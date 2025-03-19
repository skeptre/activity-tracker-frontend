import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Profile Picture */}
            <TouchableOpacity style={styles.profileContainer}>
                <Image source={{ uri: "https://example.com/profile.jpg" }} style={styles.profileImage} />
            </TouchableOpacity>

            {/* Steps Circle */}
            <View style={styles.stepsContainer}>
                <Text style={styles.stepCount}>7,568</Text>
                <Text style={styles.stepText}>DAILY STEPS</Text>
                <View style={styles.stepStats}>
                    <Text style={styles.statText}>🔥 236 kcal</Text>
                    <Text style={styles.statText}>⏳ 50 min</Text>
                    <Text style={styles.statText}>📍 5 km</Text>
                </View>
            </View>

            {/* Ranking Section */}
            <Text style={styles.sectionTitle}>Today's Ranking:</Text>
            <View style={styles.rankContainer}>
                <Text style={styles.rank}>🏆 Georia</Text>
                <Text style={styles.rank}>🥈 Jason</Text>
                <Text style={styles.rank}>🥉 Maria</Text>
            </View>

            {/* Awards Section */}
            <Text style={styles.sectionTitle}>Awards:</Text>
            <View style={styles.awardsContainer}>
                <Text style={styles.award}>🍩 OMG</Text>
                <Text style={styles.award}>🔥 HOT</Text>
            </View>

            {/* Navigation Bar */}
            <View style={styles.navBar}>
                <TouchableOpacity><Text style={styles.navText}>👥 Friends</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.navText}>📊 Stats</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.navText}>🏠 Home</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.navText}>🎁 Prizes</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.navText}>⚙️ Settings</Text></TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        alignItems: "center",
    },
    profileContainer: {
        position: "absolute",
        top: 50,
        right: 20,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    stepsContainer: {
        marginTop: 100,
        alignItems: "center",
        backgroundColor: "#FEECEF",
        borderRadius: 150,
        width: 250,
        height: 250,
        justifyContent: "center",
    },
    stepCount: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#D32F2F",
    },
    stepText: {
        fontSize: 14,
        color: "#444",
    },
    stepStats: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginTop: 10,
    },
    statText: {
        fontSize: 12,
        color: "#777",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
        color: "#D32F2F",
    },
    rankContainer: {
        marginTop: 10,
    },
    rank: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    awardsContainer: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        width: "80%",
    },
    award: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FF4081",
    },
    navBar: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#fff",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    navText: {
        fontSize: 14,
        color: "#555",
    },
});