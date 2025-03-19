import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ErrorMessageProps {
    message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    if (!message) return null; // If no message, don't render anything

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffcccc",
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        alignItems: "center",
    },
    text: {
        color: "#cc0000",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default ErrorMessage;