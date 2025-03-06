import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../styles/signUpStyles";
import { SignUpViewModel } from "../viewmodels/signUpViewModel";
import InputField from "../components/InputField";
import SocialLoginButton from "../components/SocialLoginButton";

export default function SignUpScreen() {
    const navigation = useNavigation();
    const { signUp, loading } = SignUpViewModel();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>Sign up</Text>

            {/* Input Fields */}
            <View style={styles.row}>
                <InputField placeholder="First Name" value={form.firstName} onChangeText={(text:string) => setForm({ ...form, firstName: text })} />
                <InputField placeholder="Last Name" value={form.lastName} onChangeText={(text:string) => setForm({ ...form, lastName: text })} />
            </View>
            <InputField placeholder="Username" value={form.username} onChangeText={(text:string) => setForm({ ...form, username: text })} />
            <InputField placeholder="Email Address" value={form.email} keyboardType="email-address" onChangeText={(text:string) => setForm({ ...form, email: text })} />
            <InputField placeholder="Password" secureTextEntry value={form.password} onChangeText={(text:string) => setForm({ ...form, password: text })} />
            <InputField placeholder="Confirm Password" secureTextEntry value={form.confirmPassword} onChangeText={(text:string) => setForm({ ...form, confirmPassword: text })} />

            {/* Sign Up Button */}
            <TouchableOpacity style={styles.signUpButton} onPress={() => signUp(form)}>
                <Text style={styles.signUpText}>{loading ? "Signing Up..." : "Sign Up"}</Text>
            </TouchableOpacity>

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