import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#FFF",
    },
    backButton: {
        marginBottom: 20,
    },
    backIcon: {
        fontSize: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    signUpButton: {
        backgroundColor: "#C64963",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        marginVertical: 10,
    },
    signUpText: {
        color: "#FFF",
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
        backgroundColor: "#ccc",
    },
});