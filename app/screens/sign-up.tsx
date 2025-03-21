import React, {useState} from "react";
import {View, Text, TouchableOpacity, Alert, SafeAreaView} from "react-native";
import {useNavigation} from "@react-navigation/native";
import styles from "../styles/signUpStyles";
import {SignUpViewModel} from "../viewmodels/signUpViewModel";
import InputField from "@/app/components/InputField";
import SocialLoginButton from "@/app/components/SocialLoginButton";

export default function SignUpScreen() {
    // const navigation = useNavigation();
    const {signUp, loading} = SignUpViewModel();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleSignUp = async () => {
        if (
            !form.firstName ||
            !form.lastName ||
            !form.username ||
            !form.email ||
            !form.password ||
            !form.confirmPassword
        ) {
            Alert.alert("Please fill all fields.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            Alert.alert("Passwords do not match.");
            return;
        }

        await signUp(form);
    };

    return (
        <SafeAreaView>
        <View style={styles.container}>

            {/* Title */}
            <Text style={styles.title}>Sign up</Text>

            {/* Input Fields */}
            <View style={styles.row}>
                <InputField placeholder="First Name" value={form.firstName}
                            onChangeText={(text) => setForm({...form, firstName: text})}/>
                <InputField placeholder="Last Name" value={form.lastName}
                            onChangeText={(text) => setForm({...form, lastName: text})}/>
            </View>
            <InputField placeholder="Username" value={form.username}
                        onChangeText={(text) => setForm({...form, username: text})}/>
            <InputField placeholder="Email Address" value={form.email} keyboardType="email-address"
                        onChangeText={(text) => setForm({...form, email: text})}/>
            <InputField placeholder="Password" secureTextEntry value={form.password}
                        onChangeText={(text) => setForm({...form, password: text})}/>
            <InputField placeholder="Confirm Password" secureTextEntry value={form.confirmPassword}
                        onChangeText={(text) => setForm({...form, confirmPassword: text})}/>

            {/* Signup Button */}
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={loading}>
                <Text style={styles.signUpText}>{loading ? "Signing Up..." : "Sign Up"}</Text>
            </TouchableOpacity>

            {/* OR Separator */}
            <View style={styles.orContainer}>
                <View style={styles.line}/>
                <Text style={styles.orText}>OR</Text>
                <View style={styles.line}/>
            </View>

            {/* Social Login Buttons */}
            <SocialLoginButton platform="google" text="Sign in with Google"/>
            <SocialLoginButton platform="facebook" text="Sign in with Facebook"/>
        </View>
        </SafeAreaView>
    );
}