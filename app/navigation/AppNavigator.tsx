import { createStackNavigator } from "@react-navigation/stack"; // ✅ Correct Import
import { NavigationContainer } from "@react-navigation/native";
import SignUpScreen from "@/app/screens/sign-up";
import LoginScreen from "@/app/screens/login";
import HomeScreen from "@/app/screens/home";
import { useAuth } from "@/app/hooks/useAuth";
import Loader from "@/app/components/Loader";

const Stack = createStackNavigator();

export default function AppNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loader />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <Stack.Screen name="Home" component={HomeScreen} />
            ) : (
                <>
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}