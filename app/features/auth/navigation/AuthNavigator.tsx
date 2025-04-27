import { createStackNavigator } from "@react-navigation/stack";
import { AuthStackParamList } from "../types/navigation";
import LoginView from "../views/LoginView";
import SignUpView from "../views/SignUpView";

const AuthStack = createStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginView} />
            <AuthStack.Screen name="SignUp" component={SignUpView} />
        </AuthStack.Navigator>
    );
} 