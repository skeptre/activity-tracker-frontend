import React from "react";
import { TouchableOpacity, Text, View, Image, StyleSheet } from "react-native";

const icons = {
    google: require("@/app/assets/images/google-icon.png"),
    facebook: require("@/app/assets/images/facebook-icon.png"),
};

interface SocialLoginButtonProps {
    platform: "google" | "facebook";
    text: string;
}

export default function SocialLoginButton({ platform, text }: SocialLoginButtonProps) {
    return (
        <TouchableOpacity style={styles.button}>
            <Image source={icons[platform]} style={styles.icon} />
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 15,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    text: {
        fontSize: 16,
        color: "#333",
    },
});