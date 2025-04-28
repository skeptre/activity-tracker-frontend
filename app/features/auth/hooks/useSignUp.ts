import { useState } from 'react';
import { SignUpFormData } from '../types/auth';
import { signUpService } from '../services/authService';

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (userData: SignUpFormData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await signUpService(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp,
    isLoading,
    error
  };
}; 