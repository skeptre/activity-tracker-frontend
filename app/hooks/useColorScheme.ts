import { Appearance } from "react-native";

// This function detects if the user is in Light or Dark mode
export function useColorScheme(): "light" | "dark" {
    return Appearance.getColorScheme() || "light"; // Default to light mode
}

export default useColorScheme;