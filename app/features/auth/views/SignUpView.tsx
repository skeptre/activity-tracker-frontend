import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import { observer } from 'mobx-react-lite';
import { authViewModel } from '../viewModels/AuthViewModel';
import { signUpStyles } from '../styles/signUpStyles';

const SignUpView = observer(() => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSignUp = async () => {
        await authViewModel.signUp(email, password, name);
    };

    return (
        <View style={signUpStyles.container}>
            <Image source={require('../../../assets/appIcons/1024.png')} style={signUpStyles.logo} resizeMode="contain" />
            <View style={signUpStyles.card}>
                <Text style={signUpStyles.title}>Create Account</Text>
                <TextInput
                    style={signUpStyles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#7dd3fc"
                />
                <TextInput
                    style={signUpStyles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor="#7dd3fc"
                />
                <TextInput
                    style={signUpStyles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#7dd3fc"
                />
                {authViewModel.error && (
                    <Text style={signUpStyles.error}>{authViewModel.error}</Text>
                )}
                <TouchableOpacity
                    style={signUpStyles.button}
                    onPress={handleSignUp}
                    disabled={authViewModel.isLoading}
                >
                    <Text style={signUpStyles.buttonText}>
                        {authViewModel.isLoading ? 'Creating...' : 'Sign Up'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

export default SignUpView; 