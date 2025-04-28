import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert 
} from "react-native";
import { useRouter } from "expo-router";

export default function Dashboard(): JSX.Element {
  const router = useRouter();
  const [goalWeight, setGoalWeight] = useState(85); // Updated Goal Weight to 85kg
  const [georgiaScore, setGeorgiaScore] = useState(100); // Example ranking score for Georgia
  const [jasonScore, setJasonScore] = useState(georgiaScore / 2); // Jason's score is half of Georgia's
  const [logoutError, setLogoutError] = useState<string>("");

  useEffect(() => {
    setJasonScore(georgiaScore / 2); // Update Jason's score if Georgia's score changes
  }, [georgiaScore]);

  const handleLogout = async () => {
    try {
      console.log("Attempting logout...");
      const response = await fetch("http://192.168.0.10:3333/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If your API requires an auth token, include it here:
          // "Authorization": `Bearer ${token}`,
        },
      });
      console.log("Logout response status:", response.status);

      if (!response.ok) {
        let msg = "Logout failed. Please try again.";
        try {
          const data = await response.json();
          msg = data.message || msg;
          console.log("Logout error data:", data);
        } catch (error) {
          console.log("Error parsing logout response:", error);
        }
        setLogoutError(msg);
        Alert.alert("Logout Error", msg);
        return;
      }

      console.log("Logout successful");
      Alert.alert("Success", "You have been logged out.", [
        {
          text: "OK",
          onPress: () => {
            console.log("Navigating to login screen...");
            router.replace("/loginScreen");
          },
        },
      ]);
    } catch (error: any) {
      console.error("Logout error:", error);
      setLogoutError("An error occurred. Please try again later.");
      Alert.alert("Error", "An error occurred during logout. Please try again later.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Goal Weight Circle */}
      <View style={styles.circleContainer}>
        <Text style={styles.goalWeight}>{goalWeight}kg</Text>
        <Text style={styles.goalLabel}>TARGET WEIGHT</Text>
        <View style={styles.goalDetails}>
          <Text style={styles.goalDetailText}>BMI: 23.5</Text>
          <Text style={styles.goalDetailText}>Calories: 2300/day</Text>
          <Text style={styles.goalDetailText}>Protein: 140g/day</Text>
        </View>
      </View>

      {/* Ranking & Awards Section */}
      <View style={styles.statsContainer}>
        <View style={styles.rankings}>
          <Text style={styles.sectionTitle}>Today's Ranking:</Text>
          <TouchableOpacity style={styles.rankItem}>
            <Text style={styles.rankText}>🏅 Georgia - {georgiaScore} pts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rankItem}>
            <Text style={styles.rankText}>🥈 Jason - {jasonScore} pts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rankItem}>
            <Text style={styles.rankText}>🥉 Maria - 40 pts</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.awards}>
          <Text style={styles.sectionTitle}>Achievements:</Text>
          <Text style={styles.awardText}>🏆 Top Performer</Text>
          <Text style={styles.awardText}>🔥 7-Day Streak</Text>
        </View>
      </View>

      {/* Bottom Navigation with Logout */}
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButton} onPress={handleLogout}>
          <Text style={styles.navText}>👥 Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/workouts")}>
          <Text style={styles.navText}>🏋️ Workouts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButtonActive} onPress={() => router.push("/dashboard")}>
          <Text style={styles.navText}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/daily activity goals")}>
          <Text style={styles.navText}>🎯 Goals</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/settings")}>
          <Text style={styles.navText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 20 },
  circleContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  goalWeight: { fontSize: 32, fontWeight: "bold", color: "#1976D2" },
  goalLabel: { fontSize: 14, fontWeight: "bold", color: "#888" },
  goalDetails: { flexDirection: "row", justifyContent: "space-between", width: "90%", marginTop: 10 },
  goalDetailText: { fontSize: 12, color: "#555" },
  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 30 },
  rankings: { width: "50%", padding: 10 },
  awards: { width: "50%", padding: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  rankItem: { backgroundColor: "#D1C4E9", padding: 10, borderRadius: 10, marginBottom: 5 },
  rankText: { fontSize: 14, fontWeight: "bold" },
  awardText: { fontSize: 14, fontWeight: "bold", color: "#FF5733" },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: { flex: 1, alignItems: "center" },
  navButtonActive: { flex: 1, alignItems: "center", backgroundColor: "#1976D2", borderRadius: 10, padding: 5 },
  navText: { fontSize: 14, fontWeight: "bold" },
});
