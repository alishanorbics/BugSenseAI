const mongoose = require('mongoose');
const Bug = require('../models/bug.model');
const Project = require('../models/project.model');
const User = require('../models/user.model');
const logger = require('../config/logger');
const { buildPaginationResponse } = require('../helpers/pagination');
const { generateBugAnalysis } = require('../helpers/gemini');
const { BUG_STATUS, ROLES, hasProjectAccess } = require('../utils');

const MEMBER_FIELDS = 'name email role';

const VALID_STATUS_TRANSITIONS = {
  [BUG_STATUS.ASSIGNED]: [BUG_STATUS.IN_PROGRESS],
  [BUG_STATUS.IN_PROGRESS]: [BUG_STATUS.FIXED],
  [BUG_STATUS.REOPENED]: [BUG_STATUS.IN_PROGRESS],
};

const isValidObjectId = (id) => mongoose.isValidObjectId(id);

const findOwnedBug = async (bug_id, decoded_id, action_label) => {
  const bug = await Bug.findById(bug_id).populate('project');

  if (!bug) {
    return { error: { status: 404, message: 'Bug not found.' } };
  }

  if (bug.project.created_by.toString() !== decoded_id) {
    return { error: { status: 403, message: `You do not have permission to ${action_label} this bug.` } };
  }

  return { bug };
};

const createBug = async (req, res, next) => {
  try {
    if (req.decoded.role !== ROLES.QA_ENGINEER) {
      return res.status(403).json({ success: false, message: 'Only QA Engineers can report bugs.' });
    }

    const { project_id } = req.params;

    if (!isValidObjectId(project_id)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID.' });
    }

    const project = await Project.findById(project_id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (project.created_by.toString() !== req.decoded.id) {
      return res
        .status(403)
        .json({ success: false, message: 'You do not have permission to report bugs in this project.' });
    }

    const { title, description, reproduction_steps, severity } = req.body;

    const attachments = (req.files || []).map((file) => ({
      url: `/uploads/${file.filename}`,
      original_name: file.originalname,
    }));

    const ai_analysis = await generateBugAnalysis({ title, description, reproduction_steps, severity });

    const bug = await Bug.create({
      project: project_id,
      title,
      description,
      reproduction_steps,
      severity,
      attachments,
      created_by: req.decoded.id,
      status: BUG_STATUS.CREATED,
      ...(ai_analysis ? { ai_analysis } : {}),
    });

    return res.status(201).json({
      success: true,
      message: 'Bug report created successfully.',
      data: bug,
    });
  } catch (error) {
    logger.error(`Create Bug Error: ${error.message}`);
    return next(error);
  }
};

const listBugs = async (req, res, next) => {
  try {
    const { project_id } = req.params;

    if (!isValidObjectId(project_id)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID.' });
    }

    const project = await Project.findById(project_id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (!hasProjectAccess(project, req.decoded.id)) {
      return res.status(403).json({ success: false, message: 'You do not have access to this project.' });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { project: project_id };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.assignee) {
      filter.assignee = req.query.assignee;
    }

    const [bugs, total] = await Promise.all([
      Bug.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('created_by', MEMBER_FIELDS)
        .populate('assignee', MEMBER_FIELDS)
        .lean(),
      Bug.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: '',
      data: bugs,
      ...buildPaginationResponse({ page, limit, total }),
    });
  } catch (error) {
    logger.error(`List Bugs Error: ${error.message}`);
    return next(error);
  }
};

const getBug = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid bug ID.' });
    }

    const bug = await Bug.findById(id)
      .populate('created_by', MEMBER_FIELDS)
      .populate('assignee', MEMBER_FIELDS)
      .populate('project', 'name created_by members')
      .lean();

    if (!bug) {
      return res.status(404).json({ success: false, message: 'Bug not found.' });
    }

    if (!hasProjectAccess(bug.project, req.decoded.id)) {
      return res.status(403).json({ success: false, message: 'You do not have access to this bug.' });
    }

    return res.status(200).json({
      success: true,
      message: '',
      data: bug,
    });
  } catch (error) {
    logger.error(`Get Bug Error: ${error.message}`);
    return next(error);
  }
};

const assignBug = async (req, res, next) => {
  try {
    if (req.decoded.role !== ROLES.QA_ENGINEER) {
      return res.status(403).json({ success: false, message: 'Only QA Engineers can assign bugs.' });
    }

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid bug ID.' });
    }

    const { developer_id } = req.body;

    if (!isValidObjectId(developer_id)) {
      return res.status(400).json({ success: false, message: 'Invalid developer ID.' });
    }

    const bug = await Bug.findById(id).populate('project');

    if (!bug) {
      return res.status(404).json({ success: false, message: 'Bug not found.' });
    }

    if (bug.project.created_by.toString() !== req.decoded.id) {
      return res
        .status(403)
        .json({ success: false, message: 'You do not have permission to assign this bug.' });
    }

    if (bug.status !== BUG_STATUS.CREATED) {
      return res.status(400).json({ success: false, message: 'This bug has already been assigned.' });
    }

    const is_project_member = bug.project.members.some(
      (member_id) => member_id.toString() === developer_id,
    );

    if (!is_project_member) {
      return res
        .status(400)
        .json({ success: false, message: 'This developer is not a member of the project.' });
    }

    const developer = await User.findById(developer_id);

    if (!developer || developer.role !== ROLES.DEVELOPER) {
      return res.status(400).json({ success: false, message: 'The selected user is not a Developer.' });
    }

    bug.assignee = developer_id;
    bug.status = BUG_STATUS.ASSIGNED;
    await bug.save();

    const updated_bug = await Bug.findById(id)
      .populate('created_by', MEMBER_FIELDS)
      .populate('assignee', MEMBER_FIELDS)
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Bug assigned successfully.',
      data: updated_bug,
    });
  } catch (error) {
    logger.error(`Assign Bug Error: ${error.message}`);
    return next(error);
  }
};

const updateBugStatus = async (req, res, next) => {
  try {
    if (req.decoded.role !== ROLES.DEVELOPER) {
      return res
        .status(403)
        .json({ success: false, message: 'Only the assigned Developer can update bug status.' });
    }

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid bug ID.' });
    }

    const { status } = req.body;

    const bug = await Bug.findById(id);

    if (!bug) {
      return res.status(404).json({ success: false, message: 'Bug not found.' });
    }

    if (!bug.assignee || bug.assignee.toString() !== req.decoded.id) {
      return res.status(403).json({ success: false, message: 'You are not assigned to this bug.' });
    }

    const allowed_next_statuses = VALID_STATUS_TRANSITIONS[bug.status] || [];

    if (!allowed_next_statuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: `Cannot change status from ${bug.status} to ${status}.` });
    }

    bug.status = status;
    await bug.save();

    const updated_bug = await Bug.findById(id)
      .populate('created_by', MEMBER_FIELDS)
      .populate('assignee', MEMBER_FIELDS)
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Bug status updated successfully.',
      data: updated_bug,
    });
  } catch (error) {
    logger.error(`Update Bug Status Error: ${error.message}`);
    return next(error);
  }
};

const verifyBug = async (req, res, next) => {
  try {
    if (req.decoded.role !== ROLES.QA_ENGINEER) {
      return res.status(403).json({ success: false, message: 'Only QA Engineers can verify bugs.' });
    }

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid bug ID.' });
    }

    const { bug, error } = await findOwnedBug(id, req.decoded.id, 'verify');

    if (error) {
      return res.status(error.status).json({ success: false, message: error.message });
    }

    if (bug.status !== BUG_STATUS.FIXED) {
      return res
        .status(400)
        .json({ success: false, message: `Cannot verify a bug with status ${bug.status}.` });
    }

    bug.status = BUG_STATUS.VERIFIED;
    await bug.save();

    const updated_bug = await Bug.findById(id)
      .populate('created_by', MEMBER_FIELDS)
      .populate('assignee', MEMBER_FIELDS)
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Bug verified successfully.',
      data: updated_bug,
    });
  } catch (error) {
    logger.error(`Verify Bug Error: ${error.message}`);
    return next(error);
  }
};

const closeBug = async (req, res, next) => {
  try {
    if (req.decoded.role !== ROLES.QA_ENGINEER) {
      return res.status(403).json({ success: false, message: 'Only QA Engineers can close bugs.' });
    }

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid bug ID.' });
    }

    const { bug, error } = await findOwnedBug(id, req.decoded.id, 'close');

    if (error) {
      return res.status(error.status).json({ success: false, message: error.message });
    }

    if (bug.status !== BUG_STATUS.VERIFIED) {
      return res
        .status(400)
        .json({ success: false, message: `Cannot close a bug with status ${bug.status}.` });
    }

    bug.status = BUG_STATUS.CLOSED;
    await bug.save();

    const updated_bug = await Bug.findById(id)
      .populate('created_by', MEMBER_FIELDS)
      .populate('assignee', MEMBER_FIELDS)
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Bug closed successfully.',
      data: updated_bug,
    });
  } catch (error) {
    logger.error(`Close Bug Error: ${error.message}`);
    return next(error);
  }
};

const reopenBug = async (req, res, next) => {
  try {
    if (req.decoded.role !== ROLES.QA_ENGINEER) {
      return res.status(403).json({ success: false, message: 'Only QA Engineers can reopen bugs.' });
    }

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid bug ID.' });
    }

    const { bug, error } = await findOwnedBug(id, req.decoded.id, 'reopen');

    if (error) {
      return res.status(error.status).json({ success: false, message: error.message });
    }

    if (bug.status !== BUG_STATUS.FIXED) {
      return res
        .status(400)
        .json({ success: false, message: `Cannot reopen a bug with status ${bug.status}.` });
    }

    // Assignee is intentionally retained so the same Developer can re-enter the
    // in_progress/fixed flow directly, rather than requiring QA to reassign.
    bug.status = BUG_STATUS.REOPENED;
    await bug.save();

    const updated_bug = await Bug.findById(id)
      .populate('created_by', MEMBER_FIELDS)
      .populate('assignee', MEMBER_FIELDS)
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Bug reopened successfully.',
      data: updated_bug,
    });
  } catch (error) {
    logger.error(`Reopen Bug Error: ${error.message}`);
    return next(error);
  }
};

module.exports = {
  createBug,
  listBugs,
  getBug,
  assignBug,
  updateBugStatus,
  verifyBug,
  closeBug,
  reopenBug,
};
