const mongoose = require('mongoose');
const Bug = require('../models/bug.model');
const Project = require('../models/project.model');
const logger = require('../config/logger');
const { buildPaginationResponse } = require('../helpers/pagination');
const { BUG_STATUS, ROLES, hasProjectAccess } = require('../utils');

const MEMBER_FIELDS = 'name email role';

const isValidObjectId = (id) => mongoose.isValidObjectId(id);

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

    const bug = await Bug.create({
      project: project_id,
      title,
      description,
      reproduction_steps,
      severity,
      attachments,
      created_by: req.decoded.id,
      status: BUG_STATUS.CREATED,
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

module.exports = {
  createBug,
  listBugs,
  getBug,
};
