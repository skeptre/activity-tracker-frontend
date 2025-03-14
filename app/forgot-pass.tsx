import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSendEmail = () => {
        if (!email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }
        setError("");
        // Navigate to verification page
        router.push("/appverification");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>Enter your email to reset your password</Text>

            <TextInput 
                style={styles.input} 
                placeholder="Email Address" 
                keyboardType="email-address" 
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.resetButton} onPress={handleSendEmail}>
                <Text style={styles.resetButtonText}>Send Email</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/login")} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    subtitle: { fontSize: 16, color: "#666", marginBottom: 20, textAlign: "center" },
    input: { width: "100%", height: 50, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 },
    errorText: { color: "red", fontSize: 14, marginBottom: 10 },
    resetButton: { backgroundColor: "#28a745", padding: 15, borderRadius: 8, width: "100%", alignItems: "center", marginTop: 10 },
    resetButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    backButton: { marginTop: 15 },
    backButtonText: { color: "#007bff", fontSize: 16 },
});
