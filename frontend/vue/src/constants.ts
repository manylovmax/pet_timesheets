const apiHost = 'http://api_gateway/';
const authBase = 'api/v1/auth/';
const timesheetsBase = 'api/v1/timesheets/';

const config = {
  api: {
    login: apiHost + authBase + 'login',
    verify: apiHost + authBase + 'verify',
    signup: apiHost + authBase + 'signup',
    logout: apiHost + authBase + 'logout',
    refresh: apiHost + authBase + 'refresh',
    users: apiHost + authBase + 'users',
    user: apiHost + authBase + 'user',
    record: apiHost + timesheetsBase + 'record',
    records: apiHost + timesheetsBase + 'records',
  },
  constants: {
    accessTokenLSKey: 'access-token',
    refreshTokenLSKey: 'refresh-token'
  }
};

export default config;
