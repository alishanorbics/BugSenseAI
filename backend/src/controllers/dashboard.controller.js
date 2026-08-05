const Bug = require('../models/bug.model');
const Project = require('../models/project.model');
const logger = require('../config/logger');
const { BUG_STATUS, ROLES } = require('../utils');

const getDashboardMetrics = async (req, res, next) => {
  try {
    const is_qa = req.decoded.role === ROLES.QA_ENGINEER;
    const project_filter = is_qa ? { created_by: req.decoded.id } : { members: req.decoded.id };

    const project_ids = await Project.find(project_filter).distinct('_id');

    const [open_bugs, role_metric_count] = await Promise.all([
      Bug.countDocuments({ project: { $in: project_ids }, status: { $ne: BUG_STATUS.CLOSED } }),
      is_qa
        ? Bug.countDocuments({
            project: { $in: project_ids },
            status: BUG_STATUS.CREATED,
            assignee: null,
          })
        : Bug.countDocuments({ assignee: req.decoded.id, status: { $ne: BUG_STATUS.CLOSED } }),
    ]);

    return res.status(200).json({
      success: true,
      message: '',
      data: {
        active_projects: project_ids.length,
        open_bugs,
        role_metric_count,
      },
    });
  } catch (error) {
    logger.error(`Get Dashboard Metrics Error: ${error.message}`);
    return next(error);
  }
};

module.exports = { getDashboardMetrics };
