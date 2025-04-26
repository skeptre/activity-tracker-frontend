import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/Colors';

interface SocialLoginButtonProps {
    platform: "google" | "facebook";
    text: string;
}

export default function SocialLoginButton({ platform, text }: SocialLoginButtonProps) {
    const getIcon = () => {
        switch (platform) {
            case 'google':
                return <Ionicons name="logo-google" size={24} color="#DB4437" />;
            case 'facebook':
                return <Ionicons name="logo-facebook" size={24} color="#4267B2" />;
            default:
                return null;
        }
    };

    return (
        <TouchableOpacity style={styles.button}>
            {getIcon()}
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.background,
        borderRadius: 10,
        padding: 15,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    text: {
        fontSize: 16,
        color: Colors.textPrimary,
        marginLeft: 10,
    },
});