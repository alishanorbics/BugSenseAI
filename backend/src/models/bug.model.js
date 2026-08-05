const mongoose = require('mongoose');
const { BUG_SEVERITY, BUG_STATUS } = require('../utils');

const bugSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    reproduction_steps: {
      type: String,
      trim: true,
      default: '',
    },
    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        original_name: {
          type: String,
          default: '',
        },
      },
    ],
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(BUG_STATUS),
      default: BUG_STATUS.CREATED,
    },
    severity: {
      type: String,
      enum: Object.values(BUG_SEVERITY),
      required: true,
    },
    ai_analysis: {
      summary: { type: String, default: null },
      root_causes: { type: [String], default: [] },
      affected_modules: { type: [String], default: [] },
      severity_recommendation: { type: String, default: null },
      debugging_recommendations: { type: [String], default: [] },
    },
  },
  { timestamps: true },
);

bugSchema.index({ project: 1 });
bugSchema.index({ status: 1 });
bugSchema.index({ assignee: 1 });

module.exports = mongoose.model('Bug', bugSchema);
