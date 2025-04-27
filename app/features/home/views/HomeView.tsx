import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { homeViewModel } from '../viewModels/HomeViewModel';
import { Activity } from '../models/Activity';

const ActivityItem = ({ activity }: { activity: Activity }) => (
    <View style={styles.activityItem}>
        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.description}>{activity.description}</Text>
        <View style={styles.metaContainer}>
            <Text style={styles.status}>{activity.status}</Text>
            <Text style={styles.priority}>{activity.priority}</Text>
        </View>
    </View>
);

const HomeView = observer(({ navigation }: any) => {
    useEffect(() => {
        homeViewModel.fetchActivities();
    }, []);

    if (homeViewModel.isLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (homeViewModel.error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>{homeViewModel.error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={homeViewModel.activities}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ActivityItem activity={item} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No activities found</Text>
                    </View>
                }
            />
            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('CreateActivity')}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    activityItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    status: {
        fontSize: 12,
        color: '#007AFF',
    },
    priority: {
        fontSize: 12,
        color: '#FF3B30',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        padding: 20,
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addButtonText: {
        fontSize: 30,
        color: '#fff',
    },
});

export default HomeView; 