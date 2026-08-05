export const ROUTES = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  VERIFY_RESET_CODE: 'VerifyResetCode',
  RESET_PASSWORD: 'ResetPassword',
  APP_TABS: 'AppTabs',
  DASHBOARD: 'Dashboard',
  PROJECT_LIST: 'ProjectList',
  CREATE_PROJECT: 'CreateProject',
  PROJECT_DETAIL: 'ProjectDetail',
  ADD_MEMBER: 'AddMember',
  CREATE_BUG: 'CreateBug',
  BUG_DETAIL: 'BugDetail',
  PROFILE: 'Profile',
  CHANGE_PASSWORD: 'ChangePassword',
};

export const ROUTE_OPTIONS = {
  [ROUTES.LOGIN]: { headerShown: false },
  [ROUTES.REGISTER]: { headerShown: false },
  [ROUTES.FORGOT_PASSWORD]: { headerShown: false },
  [ROUTES.VERIFY_RESET_CODE]: { headerShown: false },
  [ROUTES.RESET_PASSWORD]: { headerShown: false },
  [ROUTES.APP_TABS]: { headerShown: false },
  [ROUTES.CREATE_PROJECT]: { headerShown: false },
  [ROUTES.PROJECT_DETAIL]: { headerShown: false },
  [ROUTES.ADD_MEMBER]: { headerShown: false },
  [ROUTES.CREATE_BUG]: { headerShown: false },
  [ROUTES.BUG_DETAIL]: { headerShown: false },
  [ROUTES.CHANGE_PASSWORD]: { headerShown: false },
};

export default ROUTES;
