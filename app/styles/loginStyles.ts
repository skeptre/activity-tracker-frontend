import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    backButton: {
        marginBottom: 10,
    },
    backIcon: {
        fontSize: 34,
        color: "#000",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: "#D32F2F",
        textAlign: "right",
        marginVertical: 10,
    },
    loginButton: {
        backgroundColor: "#C44E58",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        marginVertical: 10,
    },
    loginText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    signupText: {
        textAlign: "center",
        marginVertical: 10,
    },
    signupLink: {
        color: "#C44E58",
        fontWeight: "bold",
    },
    orContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 15,
    },
    orText: {
        marginHorizontal: 10,
        fontWeight: "bold",
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#000",
    },
});

export default styles;