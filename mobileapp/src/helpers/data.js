export const ROLES = {
  QA_ENGINEER: 'qa_engineer',
  DEVELOPER: 'developer',
};

export const ROLE_OPTIONS = [
  { label: 'QA Engineer', value: ROLES.QA_ENGINEER },
  { label: 'Developer', value: ROLES.DEVELOPER },
];

export const BUG_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const SEVERITY_OPTIONS = [
  { label: 'Low', value: BUG_SEVERITY.LOW },
  { label: 'Medium', value: BUG_SEVERITY.MEDIUM },
  { label: 'High', value: BUG_SEVERITY.HIGH },
  { label: 'Critical', value: BUG_SEVERITY.CRITICAL },
];

export default { ROLES, ROLE_OPTIONS, BUG_SEVERITY, SEVERITY_OPTIONS };
