export const API_ENDPOINTS = {
  GRAPHQL: '/graphql',
  AUTH: {
    LOGIN: '/graphql',
    REGISTER: '/graphql',
    LOGOUT: '/graphql',
    SEND_OTP: '/graphql',
    CONFIRM_OTP: '/graphql',
    FORGOT_PASSWORD: '/graphql',
    RESET_PASSWORD: '/graphql',
  },
  STAFF: {
    LIST: '/graphql',
    DETAIL: '/graphql',
  },
  LEAD: {
    LIST: '/graphql',
    DETAIL: '/graphql',
    IMPORT: '/graphql',
  },
  CUSTOMER: {
    LIST: '/graphql',
    DETAIL: '/graphql',
    IMPORT: '/graphql',
  },
  CONTACT: {
    LIST: '/graphql',
    DETAIL: '/graphql',
  },
  DEAL: {
    LIST: '/graphql',
    DETAIL: '/graphql',
  },
  DASHBOARD: {
    STATISTICS: '/graphql',
    CHART: '/graphql',
  },
  AI: {
    CHAT: '/graphql',
    HISTORY: '/graphql',
  },
  SEARCH: {
    LEADS: '/graphql',
    CUSTOMERS: '/graphql',
  },
};

export const APP_CONFIG = {
  TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'current_staff',
};
