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
  users: 'users',
  workspace: 'workspaces',
  documents: {
    upload: 'documents/upload',
    uploaded: 'documents/uploaded',
    getAllByWorkspace: 'workspaces/documents',
    getById: (id: string) => `documents/${id}`,
    viewDocById: (id: string) => `documents/view/${id}`,
  },
  chat: {
    create: (id?: string) => `chat/sessions?id=${id ?? ''}`,
    session: 'chat/sessions',
    getChats: (workspaceId: string) => `chat/sessions/${workspaceId}`,
    getChat: (chatId: string) => `chat/${chatId}`,
  },
};

export const APP_ROUTES = {
  auth: 'auth',
  login: 'login',
  signup: 'signup',
  workspace: 'workspace',
};
