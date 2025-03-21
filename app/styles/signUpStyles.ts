import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    backButton: {
        marginBottom: 10,
    },
    backIcon: {
        fontSize: 24,
    },
    title: {
        fontSize: 34,
        fontWeight: "bold",
        marginBottom: 20,
        marginTop: 0,
        textAlign: "center",
    },
    row: {
        flexDirection: "column",
        justifyContent: "space-between",
    },
    signUpButton: {
        backgroundColor: "#D9534F",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        marginVertical: 10,
    },
    signUpText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    orContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 15,
    },
    orText: {
        marginHorizontal: 10,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#000",
    },
});

export default styles;