import { StyleSheet } from "react-native";
import { Colors } from "@/app/constants/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 24,
        justifyContent: "center",
    },
    backButton: {
        marginBottom: 10,
    },
    backIcon: {
        fontSize: 34,
        color: "#000",
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        color: Colors.textPrimary,
        marginBottom: 32,
        textAlign: "center",
    },
    forgotPasswordText: {
        color: Colors.textSecondary,
        textAlign: "right",
        marginTop: 8,
        marginBottom: 24,
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginVertical: 16,
        shadowColor: Colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    loginText: {
        color: Colors.background,
        fontSize: 16,
        fontWeight: "600",
    },
    signupText: {
        textAlign: "center",
        marginVertical: 16,
        color: Colors.textSecondary,
        fontSize: 14,
    },
    signupLink: {
        color: Colors.primary,
        fontWeight: "600",
    },
    orContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
    },
    orText: {
        marginHorizontal: 12,
        color: Colors.textSecondary,
        fontSize: 14,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
});

export default styles;