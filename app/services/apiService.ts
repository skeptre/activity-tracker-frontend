import { Config } from '../constants/constants';
import axios from 'axios';

/**
 * API service with connection testing functionality
 */

/**
 * Result of a connection test
 */
export interface ConnectionTestResult {
  success: boolean;
  message: string;
  timestamp: string;
  details?: Record<string, any>;
}

// Interface for endpoint test results
export interface EndpointTestResults {
  [endpoint: string]: {
    success: boolean;
    message: string;
    status?: number;
  };
}

/**
 * Test if the API can be reached
 */
export const testConnection = async (): Promise<ConnectionTestResult> => {
  try {
    const response = await fetch(`${Config.BASE_URL}/health`);
    return {
      success: response.ok,
      message: response.ok ? 'Connected to API successfully' : `API responded with status: ${response.status}`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      message: `Cannot connect to API: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Test with fallback endpoint (/version)
 */
export const testConnectionFallback = async (): Promise<ConnectionTestResult> => {
  try {
    const response = await fetch(`${Config.BASE_URL}/version`);
    return {
      success: response.ok,
      message: response.ok ? 'Connected to API via fallback endpoint' : `API responded with status: ${response.status}`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      message: `Cannot connect to fallback endpoint: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Test specific endpoints based on the API spec
 */
export const testApiEndpoints = async (): Promise<EndpointTestResults> => {
  const results: EndpointTestResults = {};
  
  // Test user login endpoint
  try {
    // We expect this to return 400 with invalid credentials, which means the endpoint exists
    await axios.post(`${Config.BASE_URL}/api/users/login`, {
      email: 'test@example.com',
      password: 'invalid_password'
    });
    results['Login'] = { success: true, message: 'Endpoint available' };
  } catch (error) {
    const axiosError = error as any;
    if (axiosError.response) {
      // If we get a 400, that's expected with invalid credentials
      if (axiosError.response.status === 400) {
        results['Login'] = { 
          success: true, 
          message: 'Endpoint processing requests', 
          status: axiosError.response.status 
        };
      } else {
        results['Login'] = { 
          success: false, 
          message: `Unexpected response: ${axiosError.response.status}`, 
          status: axiosError.response.status 
        };
      }
    } else {
      results['Login'] = { 
        success: false, 
        message: `Connection error: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }
  
  // Test user registration endpoint
  try {
    // Just checking the HEAD method to see if the endpoint exists
    await axios.head(`${Config.BASE_URL}/api/users`);
    results['Registration'] = { success: true, message: 'Endpoint available' };
  } catch (error) {
    const axiosError = error as any;
    if (axiosError.response) {
      // Any response means the endpoint exists
      results['Registration'] = { 
        success: true, 
        message: 'Endpoint exists', 
        status: axiosError.response.status 
      };
    } else {
      results['Registration'] = { 
        success: false, 
        message: `Connection error: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }
  
  // Test workouts endpoint
  try {
    // Just checking if the endpoint exists with HEAD
    await axios.head(`${Config.BASE_URL}/api/activity/workouts`);
    results['Workouts'] = { success: true, message: 'Endpoint available' };
  } catch (error) {
    const axiosError = error as any;
    if (axiosError.response) {
      // If we get a 401, that's expected as this endpoint requires auth
      if (axiosError.response.status === 401) {
        results['Workouts'] = { 
          success: true, 
          message: 'Endpoint requires authentication', 
          status: axiosError.response.status 
        };
      } else {
        results['Workouts'] = { 
          success: true, 
          message: `Endpoint exists (${axiosError.response.status})`, 
          status: axiosError.response.status 
        };
      }
    } else {
      results['Workouts'] = { 
        success: false, 
        message: `Connection error: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }
  
  return results;
};

const apiService = {
  testConnection,
  testConnectionFallback,
  testApiEndpoints
};

export default apiService; 