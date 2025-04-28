import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Picker, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function WorkoutDetailsPage() {
  const router = useRouter();
  const [selectedWorkoutID, setSelectedWorkoutID] = useState("custom");
  const [workout, setWorkout] = useState({ name: "", description: "" });
  const [customWorkouts, setCustomWorkouts] = useState([]);

  const mockWorkouts = {
    1: { name: "Morning Cardio", description: "Kickstart your day with 30 minutes of jogging and 20 jumping jacks." },
    2: { name: "Leg Day Strength", description: "Target your lower body with squats, lunges, and calf raises." },
    3: { name: "Yoga Flex", description: "Relax and stretch with balance-focused yoga poses for 20 minutes." },
  };

  const handleWorkoutChange = (value) => {
    if (value === "custom") {
      setWorkout({ name: "", description: "" });
    } else {
      setWorkout(mockWorkouts[value]);
    }
    setSelectedWorkoutID(value);
  };

  const handleAddWorkout = () => {
    if (workout.name.trim() === "" || workout.description.trim() === "") {
      alert("Please enter a workout name and description.");
      return;
    }
    setCustomWorkouts([...customWorkouts, workout]);
    setWorkout({ name: "", description: "" });
  };

  const handleDeleteWorkout = (index) => {
    const updatedWorkouts = customWorkouts.filter((_, i) => i !== index);
    setCustomWorkouts(updatedWorkouts);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Workout Details</Text>

      {/* Workout Selector */}
      <Picker selectedValue={selectedWorkoutID} style={styles.picker} onValueChange={handleWorkoutChange}>
        <Picker.Item label="Custom Workout" value="custom" />
        <Picker.Item label="Morning Cardio" value="1" />
        <Picker.Item label="Leg Day Strength" value="2" />
        <Picker.Item label="Yoga Flex" value="3" />
      </Picker>

      {/* Custom Workout Input Fields */}
      <TextInput
        style={styles.input}
        value={workout.name}
        onChangeText={(text) => setWorkout((prev) => ({ ...prev, name: text }))}
        placeholder="Workout Name"
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        value={workout.description}
        onChangeText={(text) => setWorkout((prev) => ({ ...prev, description: text }))}
        placeholder="Workout Description"
        multiline
      />

      {/* Add Workout Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddWorkout}>
        <Text style={styles.buttonText}>Add Workout</Text>
      </TouchableOpacity>

      {/* Custom Workouts List */}
      {customWorkouts.length > 0 && (
        <View style={styles.customWorkoutsContainer}>
          <Text style={styles.sectionTitle}>Your Workouts:</Text>
          {customWorkouts.map((w, index) => (
            <View key={index} style={styles.workoutItem}>
              <View style={styles.workoutTextContainer}>
                <Text style={styles.workoutName}>{w.name}</Text>
                <Text style={styles.workoutDesc}>{w.description}</Text>
              </View>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteWorkout(index)}>
                <Text style={styles.buttonText}>❌</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Back to Workouts Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/dashboard")}>
        <Text style={styles.buttonText}>⬅ Back to dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  picker: { height: 50, width: "100%", marginBottom: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#f1f1f1",
  },
  addButton: { backgroundColor: "#28a745", padding: 15, borderRadius: 10, marginBottom: 10 },
  deleteButton: { backgroundColor: "#dc3545", padding: 10, borderRadius: 8, marginLeft: 10 },
  backButton: { backgroundColor: "#6c757d", padding: 15, borderRadius: 10, marginTop: 15 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  customWorkoutsContainer: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  workoutItem: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  workoutTextContainer: { flex: 1 },
  workoutName: { fontSize: 16, fontWeight: "bold" },
  workoutDesc: { fontSize: 14, color: "#555" },
});
