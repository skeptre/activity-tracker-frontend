import { Platform } from 'react-native';

// For Android, use the machine's IP address instead of localhost
const DEV_API_URL = Platform.select({
    ios: 'http://localhost:3333/api',
    android: 'http://10.0.2.2:3333/api', // Android emulator maps 10.0.2.2 to host machine's localhost
    default: 'http://localhost:3333/api',
});

// Production API URL (you should change this to your actual production API URL)
const PROD_API_URL = 'https://your-production-api.com/api';

export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

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