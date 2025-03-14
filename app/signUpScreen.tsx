import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
    const router = useRouter();
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
            <Text style={styles.title}>Sign Up</Text>
            <TextInput style={styles.input} placeholder="First Name" value={form.firstName} onChangeText={(text) => setForm({ ...form, firstName: text })} />
            <TextInput style={styles.input} placeholder="Last Name" value={form.lastName} onChangeText={(text) => setForm({ ...form, lastName: text })} />
            <TextInput style={styles.input} placeholder="Username" value={form.username} onChangeText={(text) => setForm({ ...form, username: text })} />
            <TextInput style={styles.input} placeholder="Email Address" keyboardType="email-address" value={form.email} onChangeText={(text) => setForm({ ...form, email: text })} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={form.password} onChangeText={(text) => setForm({ ...form, password: text })} />
            <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={form.confirmPassword} onChangeText={(text) => setForm({ ...form, confirmPassword: text })} />

            <TouchableOpacity style={styles.signUpButton}>
                <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/loginScreen")} style={styles.loginButton}>
                <Text style={styles.loginText}>Already have an account? Log in</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    input: { width: "100%", height: 50, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 },
    signUpButton: { backgroundColor: "#28a745", padding: 15, borderRadius: 8, width: "100%", alignItems: "center", marginTop: 10 },
    signUpText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    loginButton: { marginTop: 15 },
    loginText: { color: "#007bff", fontSize: 16 },
});
