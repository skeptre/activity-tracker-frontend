import React from "react";
import { TextInput, View, StyleSheet, TextInputProps } from "react-native";
import { Colors } from "@/app/constants/Colors";

interface InputFieldProps extends TextInputProps {
    placeholder: string;
}

export default function InputField({ placeholder, ...props }: InputFieldProps) {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={Colors.placeholder}
                autoCapitalize="none"
                autoCorrect={false}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: Colors.inputBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        paddingHorizontal: 16,
        height: 52,
        justifyContent: "center",
        marginBottom: 16,
        shadowColor: Colors.shadow,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    input: {
        fontSize: 16,
        color: Colors.textPrimary,
        height: "100%",
    },
});