import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@/app/types/navigation';
import { useAuth } from './useAuth';

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

export function useSignUp() {
    const navigation = useNavigation<SignUpScreenNavigationProp>();
    const { signup } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = async (email: string, password: string, name: string) => {
        try {
            setLoading(true);
            setError(null);
            await signup(email, password, name);
            navigation.navigate('Login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during sign up');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        handleSignUp,
    };
} 