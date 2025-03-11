import React from "react";
import { AuthProvider } from "./hooks/useAuth"; // Import the provider
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function App() {
    return (
        <AuthProvider>
            <SafeAreaProvider>
                <Stack />
            </SafeAreaProvider>
        </AuthProvider>
    );
}
