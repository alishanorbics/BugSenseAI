export const ROUTES = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  VERIFY_RESET_CODE: 'VerifyResetCode',
  RESET_PASSWORD: 'ResetPassword',
};

export const ROUTE_OPTIONS = {
  [ROUTES.LOGIN]: { headerShown: false },
  [ROUTES.REGISTER]: { headerShown: false },
  [ROUTES.FORGOT_PASSWORD]: { headerShown: false },
  [ROUTES.VERIFY_RESET_CODE]: { headerShown: false },
  [ROUTES.RESET_PASSWORD]: { headerShown: false },
};

export default ROUTES;
