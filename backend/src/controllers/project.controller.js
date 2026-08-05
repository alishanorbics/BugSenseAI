const mongoose = require('mongoose');
const Project = require('../models/project.model');
const User = require('../models/user.model');
const logger = require('../config/logger');
const { buildPaginationResponse } = require('../helpers/pagination');
const { ROLES } = require('../utils');

const MEMBER_FIELDS = 'name email role';

const isValidObjectId = (id) => mongoose.isValidObjectId(id);

const createProject = async (req, res, next) => {
  try {
    if (req.decoded.role !== ROLES.QA_ENGINEER) {
      return res.status(403).json({ success: false, message: 'Only QA Engineers can create projects.' });
    }

    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      created_by: req.decoded.id,
      members: [],
    });

    return res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: project,
    });
  } catch (error) {
    logger.error(`Create Project Error: ${error.message}`);
    return next(error);
  }
};

const listProjects = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter =
      req.decoded.role === ROLES.QA_ENGINEER
        ? { created_by: req.decoded.id }
        : { members: req.decoded.id };

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('created_by', MEMBER_FIELDS)
        .lean(),
      Project.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: '',
      data: projects,
      ...buildPaginationResponse({ page, limit, total }),
    });
  } catch (error) {
    logger.error(`List Projects Error: ${error.message}`);
    return next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID.' });
    }

    const project = await Project.findById(id)
      .populate('created_by', MEMBER_FIELDS)
      .populate('members', MEMBER_FIELDS)
      .lean();

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const is_creator = project.created_by._id.toString() === req.decoded.id;
    const is_member = project.members.some((member) => member._id.toString() === req.decoded.id);

    if (!is_creator && !is_member) {
      return res.status(403).json({ success: false, message: 'You do not have access to this project.' });
    }

    return res.status(200).json({
      success: true,
      message: '',
      data: project,
    });
  } catch (error) {
    logger.error(`Get Project Error: ${error.message}`);
    return next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    if (req.decoded.role !== ROLES.QA_ENGINEER) {
      return res.status(403).json({ success: false, message: 'Only QA Engineers can update projects.' });
    }

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID.' });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (project.created_by.toString() !== req.decoded.id) {
      return res
        .status(403)
        .json({ success: false, message: 'You do not have permission to update this project.' });
    }

    const updated_project = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate('created_by', MEMBER_FIELDS);

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      data: updated_project,
    });
  } catch (error) {
    logger.error(`Update Project Error: ${error.message}`);
    return next(error);
  }
};

const listMembers = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID.' });
    }

    const project = await Project.findById(id).populate('members', MEMBER_FIELDS).lean();

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const is_creator = project.created_by.toString() === req.decoded.id;
    const is_member = project.members.some((member) => member._id.toString() === req.decoded.id);

    if (!is_creator && !is_member) {
      return res.status(403).json({ success: false, message: 'You do not have access to this project.' });
    }

    return res.status(200).json({
      success: true,
      message: '',
      data: project.members,
    });
  } catch (error) {
    logger.error(`List Members Error: ${error.message}`);
    return next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    if (req.decoded.role !== ROLES.QA_ENGINEER) {
      return res.status(403).json({ success: false, message: 'Only QA Engineers can add members.' });
    }

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID.' });
    }

    const { email, role } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (project.created_by.toString() !== req.decoded.id) {
      return res
        .status(403)
        .json({ success: false, message: 'You do not have permission to modify this project.' });
    }

    const member = await User.findOne({ email });

    if (!member) {
      return res.status(404).json({ success: false, message: 'No user found with this email.' });
    }

    if (member.role !== role) {
      return res.status(400).json({ success: false, message: `This user is not a ${role}.` });
    }

    const already_member = project.members.some(
      (member_id) => member_id.toString() === member._id.toString(),
    );

    if (already_member) {
      return res
        .status(409)
        .json({ success: false, message: 'This user is already a member of the project.' });
    }

    project.members.push(member._id);
    await project.save();

    const updated_project = await Project.findById(id).populate('members', MEMBER_FIELDS).lean();

    return res.status(200).json({
      success: true,
      message: 'Member added successfully.',
      data: updated_project.members,
    });
  } catch (error) {
    logger.error(`Add Member Error: ${error.message}`);
    return next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    if (req.decoded.role !== ROLES.QA_ENGINEER) {
      return res.status(403).json({ success: false, message: 'Only QA Engineers can remove members.' });
    }

    const { id, member_id } = req.params;

    if (!isValidObjectId(id) || !isValidObjectId(member_id)) {
      return res.status(400).json({ success: false, message: 'Invalid project or member ID.' });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (project.created_by.toString() !== req.decoded.id) {
      return res
        .status(403)
        .json({ success: false, message: 'You do not have permission to modify this project.' });
    }

    project.members = project.members.filter(
      (existing_member_id) => existing_member_id.toString() !== member_id,
    );
    await project.save();

    const updated_project = await Project.findById(id).populate('members', MEMBER_FIELDS).lean();

    return res.status(200).json({
      success: true,
      message: 'Member removed successfully.',
      data: updated_project.members,
    });
  } catch (error) {
    logger.error(`Remove Member Error: ${error.message}`);
    return next(error);
  }
};

module.exports = {
  createProject,
  listProjects,
  getProject,
  updateProject,
  listMembers,
  addMember,
  removeMember,
};
