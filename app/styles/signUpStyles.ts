import { StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";
import { useColorScheme } from "@/app/hooks/useColorScheme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  backButton: {
    marginBottom: 10,
  },
  backIcon: {
    fontSize: 34,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  signUpButton: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginVertical: 10,
  },
  signUpText: {
    color: "white",
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
    backgroundColor: "#000000",
  },
});

export default styles;
