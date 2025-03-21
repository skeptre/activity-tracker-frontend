import React from "react";
import { TextInput, View, StyleSheet, TextInputProps } from "react-native";

interface InputFieldProps extends TextInputProps {
    placeholder: string;
}

export default function InputField({ placeholder, ...props }: InputFieldProps) {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#999"
                textContentType="password"
                {...props} />
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 3,
        borderColor: "#ccc",
        paddingHorizontal: 15,
        height: 50,
        justifyContent: "center",
        marginBottom: 10,
    },
    input: {
        fontSize: 16,
        color: "#000",
    },
});