import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function VerificationScreen() {
    const router = useRouter();
    const [code, setCode] = useState("");

    const handleVerifyCode = () => {
        if (code.length !== 4) {
            Alert.alert("Invalid Code", "Please enter a 4-digit verification code.");
            return;
        }
        Alert.alert("Success", "Code verified! You can now reset your password.");
        // Navigate to reset password screen (if implemented)
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verification Code</Text>
            <Text style={styles.subtitle}>Enter the 4-digit code sent to your email</Text>

            <TextInput 
                style={styles.input} 
                placeholder="Enter Code" 
                keyboardType="numeric" 
                maxLength={4}
                value={code}
                onChangeText={setCode}
            />

            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyCode}>
                <Text style={styles.verifyButtonText}>Verify Code</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/forgot-pass")} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back to Forgot Password</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    subtitle: { fontSize: 16, color: "#666", marginBottom: 20, textAlign: "center" },
    input: { width: "100%", height: 50, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 10, marginBottom: 10, textAlign: "center", fontSize: 18 },
    verifyButton: { backgroundColor: "#28a745", padding: 15, borderRadius: 8, width: "100%", alignItems: "center", marginTop: 10 },
    verifyButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    backButton: { marginTop: 15 },
    backButtonText: { color: "#007bff", fontSize: 16 },
});
