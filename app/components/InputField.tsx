import React from "react";
import { TextInput, View, StyleSheet, TextInputProps } from "react-native";

interface InputFieldProps extends TextInputProps {
    placeholder: string;
}

export default function InputField({ placeholder, ...props }: InputFieldProps) {
    return (
        <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder={placeholder} {...props} />
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: "#FEEFEF",
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
        justifyContent: "center",
        marginBottom: 10,
    },
    input: {
        fontSize: 16,
        color: "#333",
    },
});