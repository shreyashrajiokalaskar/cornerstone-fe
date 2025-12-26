export enum SESSION_KEYS {
  TOKEN = 'token',
  REFRESH_TOKEN = 'refresh_token',
  EMAIL = 'email',
  USER = 'user',
}

export const API_ENDPOINTS = {
  auth: {
    login: 'auth/login',
    logout: 'auth/logout',
    signup: 'auth/signup',
    googleLogin: 'auth/google-login',
    refresh: 'auth/refresh',
    verifyCode: (code: string, state: string) => `auth/google-verify?code=${code}&state=${state}`,
  },
};

export const ROUTES = {
  auth: 'auth',
  login: 'login',
  signup: 'signup',
  dashboard: 'dashboard',
};
