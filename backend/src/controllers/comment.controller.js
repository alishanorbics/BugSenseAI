const mongoose = require('mongoose');
const Bug = require('../models/bug.model');
const Comment = require('../models/comment.model');
const logger = require('../config/logger');
const { buildPaginationResponse } = require('../helpers/pagination');
const { hasProjectAccess } = require('../utils');

const AUTHOR_FIELDS = 'name email role';

const isValidObjectId = (id) => mongoose.isValidObjectId(id);

const findAccessibleBug = async (bug_id, decoded_id) => {
  const bug = await Bug.findById(bug_id).populate('project');

  if (!bug) {
    return { error: { status: 404, message: 'Bug not found.' } };
  }

  if (!hasProjectAccess(bug.project, decoded_id)) {
    return { error: { status: 403, message: 'You do not have access to this bug.' } };
  }

  return { bug };
};

const createComment = async (req, res, next) => {
  try {
    const { id: bug_id } = req.params;

    if (!isValidObjectId(bug_id)) {
      return res.status(400).json({ success: false, message: 'Invalid bug ID.' });
    }

    const { bug, error } = await findAccessibleBug(bug_id, req.decoded.id);

    if (error) {
      return res.status(error.status).json({ success: false, message: error.message });
    }

    const { text } = req.body;

    const comment = await Comment.create({
      bug: bug._id,
      author: req.decoded.id,
      text,
    });

    const populated_comment = await Comment.findById(comment._id).populate('author', AUTHOR_FIELDS).lean();

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully.',
      data: populated_comment,
    });
  } catch (error) {
    logger.error(`Create Comment Error: ${error.message}`);
    return next(error);
  }
};

const listComments = async (req, res, next) => {
  try {
    const { id: bug_id } = req.params;

    if (!isValidObjectId(bug_id)) {
      return res.status(400).json({ success: false, message: 'Invalid bug ID.' });
    }

    const { bug, error } = await findAccessibleBug(bug_id, req.decoded.id);

    if (error) {
      return res.status(error.status).json({ success: false, message: error.message });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { bug: bug._id };

    const [comments, total] = await Promise.all([
      Comment.find(filter)
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .populate('author', AUTHOR_FIELDS)
        .lean(),
      Comment.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: '',
      data: comments,
      ...buildPaginationResponse({ page, limit, total }),
    });
  } catch (error) {
    logger.error(`List Comments Error: ${error.message}`);
    return next(error);
  }
};

module.exports = { createComment, listComments };
