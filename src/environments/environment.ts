const API_URL = 'http://localhost:3000';

export const environment = {
  production: false,
  api: {
    users: `${API_URL}/users`,
    companies: `${API_URL}/companies`
  }
};
