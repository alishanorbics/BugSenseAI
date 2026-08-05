const ENV = {
  development: {
    API_BASE_URL: 'http://localhost:5050/api',
    FILE_BASE_URL: 'http://localhost:5050',
  },
  production: {
    API_BASE_URL: 'https://bugsense-backend-production.up.railway.app/api',
    FILE_BASE_URL: 'https://bugsense-backend-production.up.railway.app',
  },
};

const current_env = __DEV__ ? ENV.development : ENV.production;

export default current_env;
