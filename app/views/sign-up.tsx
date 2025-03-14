import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "@/app/styles/signUpStyles";
import { SignUpViewModel } from "../viewmodels/authStore";
import InputField from "../components/InputField";
import SocialLoginButton from "../components/SocialLoginButton";
import { User } from "../assets/types/types";

export default function SignUp() {
  const navigation = useNavigation();
  const { signUp, progress } = SignUpViewModel();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignUp = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      console.log("Please fill all fields");
      Alert.alert("Please fill all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      console.log("Passwords do not match");
      Alert.alert("Passwords do not match.");
      return;
    }

    const userData: User = {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      password: form.password,
    };

    await signUp(userData);
  };

  useEffect(() => {
    if (progress.error) {
      console.log(progress.error);
    }

    if (progress.loading) {
      console.log("Signing Up...");
    }

    if (progress.success) {
      console.log("Sign Up successful");
    }
  }, [progress]);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Sign up</Text>

      {/* Input Fields */}
      <View style={styles.row}>
        <InputField
          placeholder="First Name"
          value={form.firstName}
          onChangeText={(text: string) => setForm({ ...form, firstName: text })}
        />
        <InputField
          placeholder="Last Name"
          value={form.lastName}
          onChangeText={(text: string) => setForm({ ...form, lastName: text })}
        />
      </View>
      <InputField
        placeholder="Email Address"
        value={form.email}
        keyboardType="email-address"
        onChangeText={(text: string) => setForm({ ...form, email: text })}
      />
      <InputField
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(text: string) => setForm({ ...form, password: text })}
      />
      <InputField
        placeholder="Confirm Password"
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={(text: string) =>
          setForm({ ...form, confirmPassword: text })
        }
      />

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={handleSignUp}
        disabled={progress.loading}
      >
        <Text style={styles.signUpText}>
          {progress.loading ? "Signing Up..." : "Sign Up"}
        </Text>
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
