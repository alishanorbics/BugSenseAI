const ROLES = {
  QA_ENGINEER: 'qa_engineer',
  DEVELOPER: 'developer',
};

const BUG_STATUS = {
  CREATED: 'created',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  FIXED: 'fixed',
  VERIFIED: 'verified',
  CLOSED: 'closed',
  REOPENED: 'reopened',
};

const BUG_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

const hasProjectAccess = (project, decoded_id) => {
  const is_creator = project.created_by.toString() === decoded_id;
  const is_member = project.members.some((member_id) => member_id.toString() === decoded_id);

  return is_creator || is_member;
};

module.exports = { ROLES, BUG_STATUS, BUG_SEVERITY, hasProjectAccess };
