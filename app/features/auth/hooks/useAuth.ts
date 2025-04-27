import { useEffect, useState } from 'react';
import { authViewModel } from '../viewModels/AuthViewModel';

export const useAuth = () => {
    const [user, setUser] = useState(authViewModel.user);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = authViewModel.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
}; 