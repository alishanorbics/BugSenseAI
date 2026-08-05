const ENV = {
  development: {
    API_BASE_URL: 'http://localhost:5050/api',
    FILE_BASE_URL: 'http://localhost:5050',
  },
  production: {
    API_BASE_URL: 'https://api.bugsense.app/api',
    FILE_BASE_URL: 'https://api.bugsense.app',
  },
};

const current_env = __DEV__ ? ENV.development : ENV.production;

export default current_env;
