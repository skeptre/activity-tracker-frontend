import { NavigatorScreenParams } from '@react-navigation/native';
import { AuthStackParamList } from '@/app/features/auth/types/navigation';
import { MainStackParamList } from '@/app/features/home/types/navigation';

export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    Main: NavigatorScreenParams<MainStackParamList>;
};

export { AuthStackParamList } from '@/app/features/auth/types/navigation';
export { MainStackParamList } from '@/app/features/home/types/navigation'; 