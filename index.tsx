import { registerRootComponent } from "expo";
import React from "react";
import { AuthProvider } from "./app/hooks/useAuth"; // Authentication context
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useColorScheme } from "./app/hooks/useColorScheme";
import { createStackNavigator } from "@react-navigation/stack";

// Import Screens
import SignUpScreen from "./app/screens/sign-up";
import LoginScreen from "./app/screens/login";
import HomeScreen from "./app/screens/home";

// Create Stack Navigator
const Stack = createStackNavigator();

function App() {
    const colorScheme = useColorScheme(); // Detect light/dark mode

    return (
        <AuthProvider>
            <SafeAreaProvider>
                <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                    <NavigationContainer>
                        <Stack.Navigator initialRouteName="SignUp">
                            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </ThemeProvider>
            </SafeAreaProvider>
        </AuthProvider>
    );
}

// ✅ Register the root component
registerRootComponent(App);

export default App;