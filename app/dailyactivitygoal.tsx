import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";

export default function DailyGoalsScreen() {
  const router = useRouter();
  const [goal, setGoal] = useState(6000);
  const [progress, setProgress] = useState(0);
  const [progressRecords, setProgressRecords] = useState([]);

  const handleUpdateGoal = () => {
    alert(`Goal updated to ${goal} steps`);
  };

  const handleAddProgress = () => {
    if (!progress) return;
    const record = {
      id: Date.now().toString(),
      value: progress,
      recorded_at: new Date().toLocaleString(),
    };
    setProgressRecords([...progressRecords, record]);
    setProgress(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Activity Goals</Text>

      <Text style={styles.label}>Target Steps:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={goal.toString()}
        onChangeText={(text) => setGoal(parseInt(text) || 0)}
      />
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateGoal}>
        <Text style={styles.buttonText}>Update Goal</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Add Progress:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={progress.toString()}
        onChangeText={(text) => setProgress(parseInt(text) || 0)}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddProgress}>
        <Text style={styles.buttonText}>Add Progress</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Progress Records:</Text>
      <FlatList
        data={progressRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordItem}>
            <Text style={styles.recordText}>+{item.value} steps</Text>
            <Text style={styles.recordTime}>{item.recorded_at}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/dashboard")}> 
        <Text style={styles.buttonText}>⬅ Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  updateButton: { backgroundColor: "#28a745", padding: 15, borderRadius: 10, marginBottom: 10 },
  addButton: { backgroundColor: "#007bff", padding: 15, borderRadius: 10, marginBottom: 20 },
  backButton: { backgroundColor: "#6c757d", padding: 15, borderRadius: 10, marginTop: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  recordItem: { padding: 10, backgroundColor: "#eee", borderRadius: 8, marginBottom: 5 },
  recordText: { fontSize: 14, fontWeight: "bold" },
  recordTime: { fontSize: 12, color: "#555" },
});
