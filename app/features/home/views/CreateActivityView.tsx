import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { homeViewModel } from '../viewModels/HomeViewModel';
import { Activity } from '../models/Activity';

const CreateActivityView = observer(({ navigation }: any) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState<Activity['priority']>('medium');
    const [startTime, setStartTime] = useState(new Date());

    const handleCreate = async () => {
        if (!title.trim()) {
            // TODO: Show error message
            return;
        }

        const newActivity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'> = {
            title: title.trim(),
            description: description.trim(),
            category: category.trim(),
            priority,
            startTime,
            status: 'pending'
        };

        await homeViewModel.createActivity(newActivity);
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Enter activity title"
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter activity description"
                    multiline
                    numberOfLines={4}
                />

                <Text style={styles.label}>Category</Text>
                <TextInput
                    style={styles.input}
                    value={category}
                    onChangeText={setCategory}
                    placeholder="Enter category"
                />

                <Text style={styles.label}>Priority</Text>
                <View style={styles.priorityContainer}>
                    {(['low', 'medium', 'high'] as const).map((p) => (
                        <TouchableOpacity
                            key={p}
                            style={[
                                styles.priorityButton,
                                priority === p && styles.priorityButtonActive
                            ]}
                            onPress={() => setPriority(p)}
                        >
                            <Text style={[
                                styles.priorityButtonText,
                                priority === p && styles.priorityButtonTextActive
                            ]}>
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleCreate}
                    disabled={homeViewModel.isLoading}
                >
                    <Text style={styles.createButtonText}>
                        {homeViewModel.isLoading ? 'Creating...' : 'Create Activity'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    form: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 15,
    },
    priorityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    priorityButton: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    priorityButtonActive: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    priorityButtonText: {
        fontSize: 14,
        color: '#333',
    },
    priorityButtonTextActive: {
        color: '#fff',
    },
    createButton: {
        backgroundColor: '#007AFF',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    createButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CreateActivityView; 