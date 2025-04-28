import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function WorkoutDetailsPage() {
  const router = useRouter();
  const { workoutID } = useLocalSearchParams();
  const [workout, setWorkout] = useState({ name: "", description: "" });

  // Simulate fetching workout details
  useEffect(() => {
    // In a real app you'd fetch from API
    const mockWorkout = {
      1: { name: "Morning Cardio", description: "Jog for 30 min + jumping jacks" },
      2: { name: "Leg Day Strength", description: "Squats, lunges, calf raises" },
      3: { name: "Yoga Flex", description: "Stretching + core balance" },
    };

    if (mockWorkout[workoutID]) {
      setWorkout(mockWorkout[workoutID]);
    } else {
      setWorkout({ name: "Unknown Workout", description: "No details available" });
    }
  }, [workoutID]);

  const handleUpdate = () => {
    console.log("Updated workout:", workout);
    router.push("/workouts");
  };

  const handleDelete = () => {
    console.log("Deleted workout ID:", workoutID);
    router.push("/workouts");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout #{workoutID}</Text>

      <TextInput
        style={styles.input}
        value={workout.name}
        onChangeText={(text) => setWorkout((prev) => ({ ...prev, name: text }))}
        placeholder="Workout Name"
      />

      <TextInput
        style={styles.input}
        value={workout.description}
        onChangeText={(text) => setWorkout((prev) => ({ ...prev, description: text }))}
        placeholder="Workout Description"
        multiline
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Workout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete Workout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/workouts")}>
        <Text style={styles.buttonText}>⬅ Back to Workouts</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  updateButton: { backgroundColor: "#007bff", padding: 15, borderRadius: 10, marginBottom: 10 },
  deleteButton: { backgroundColor: "#dc3545", padding: 15, borderRadius: 10, marginBottom: 10 },
  backButton: { backgroundColor: "#6c757d", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
