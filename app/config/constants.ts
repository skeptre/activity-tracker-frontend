export const API_URL = 'http://localhost:3333/api';

export const APP_CONSTANTS = {
    MIN_PASSWORD_LENGTH: 8,
    MAX_NAME_LENGTH: 50,
    TOKEN_KEY: 'auth_token',
    USER_KEY: 'user_data'
};

export const Config = {
    BASE_URL: API_URL,
    ...APP_CONSTANTS
};

export default Config; 