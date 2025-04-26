import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { styles } from "@/app/styles/loginStyles";
import InputField from "@/app/components/InputField";
import SocialLoginButton from "@/app/components/SocialLoginButton";
import { useAuth } from "@/app/hooks/useAuth";
import { AuthStackParamList } from "@/app/types/navigation";

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export default function Login() {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { login, loading } = useAuth(); // Get login function from Auth context

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleLogin = async () => {
        if (!form.email || !form.password) {
            alert("Please fill in all fields.");
            return;
        }
        try {
            await login(form.email, form.password);
        } catch (error) {
            alert("Invalid credentials, please try again.");
        }
    };

    return (
        <View style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>Sign in</Text>

            {/* Input Fields */}
            <InputField
                placeholder="Email Address"
                keyboardType="email-address"
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
            />
            <InputField
                placeholder="Password"
                secureTextEntry
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
            />

            {/* Forgot Password */}
            <TouchableOpacity onPress={() => alert("Forgot Password Clicked!")}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                <Text style={styles.loginText}>{loading ? "Logging in..." : "Log in"}</Text>
            </TouchableOpacity>

            {/* Signup Link */}
            <Text style={styles.signupText}>
                Don't have an account?{" "}
                <Text style={styles.signupLink} onPress={() => navigation.navigate('SignUp')}>
                    Sign up
                </Text>
            </Text>

            {/* OR Separator */}
            <View style={styles.orContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.line} />
            </View>

            {/* Social Login Buttons */}
            <SocialLoginButton platform="google" text="Sign in with Google" />
            <SocialLoginButton platform="facebook" text="Sign in with Facebook" />
        </View>
    );
} 