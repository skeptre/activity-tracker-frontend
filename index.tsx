import { registerRootComponent } from "expo";
import React from "react";
import { AuthProvider } from "./app/features/auth/providers/AuthProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "./app/hooks/useColorScheme";
import AppNavigator from "./app/navigation/AppNavigator";

function App() {
    const colorScheme = useColorScheme(); // Detect light/dark mode

    return (
        <AuthProvider>
            <SafeAreaProvider>
                <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                    <AppNavigator />
                </ThemeProvider>
            </SafeAreaProvider>
        </AuthProvider>
    );
}

// ✅ Register the root component
registerRootComponent(App);

export default App;