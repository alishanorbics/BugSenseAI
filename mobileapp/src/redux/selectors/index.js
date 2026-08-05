export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.is_authenticated;

export const selectFirstLaunch = (state) => state.general.first_launch;
export const selectAppConfig = (state) => state.general.app_config;
