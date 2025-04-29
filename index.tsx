import { registerRootComponent } from "expo";
import React from "react";
import { AuthProvider } from "./app/features/auth/providers/AuthProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "./app/hooks/useColorScheme";
import AppNavigator from "./app/navigation/AppNavigator";
import { ThemeProvider } from "./app/providers/ThemeProvider";
import { StepCounterProvider } from "./app/providers/StepCounterProvider";

function App() {
    const colorScheme = useColorScheme(); // Detect light/dark mode

    return (
        <ThemeProvider>
            <AuthProvider>
                <StepCounterProvider>
                    <SafeAreaProvider>
                        <NavigationThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                            <AppNavigator />
                        </NavigationThemeProvider>
                    </SafeAreaProvider>
                </StepCounterProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

// ✅ Register the root component
registerRootComponent(App);

export default App;