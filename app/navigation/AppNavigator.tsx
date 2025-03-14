import { View, Text, ImageBackground } from "react-native";
import React from "react";
import SignUpScreen from "@/app/signUpScreen";
import {AuthProvider} from "@/app/hooks/useAuth";
import LoginScreen  from "@/app/loginScreen";
import { Stack } from "expo-router";
import forgot_password from "@/app/forgot-pass";

export default function App() {
    return (
        <AuthProvider>
            <SignUpScreen>
                
            </SignUpScreen>
        </AuthProvider>
    );
}
