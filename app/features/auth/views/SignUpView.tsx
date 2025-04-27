import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';
import { authViewModel } from '../viewModels/AuthViewModel';
import { signUpStyles } from '../styles/signUpStyles';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const SignUpView = observer(({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [firstName, setFirstName] = useState(__DEV__ ? 'John' : '');
    const [lastName, setLastName] = useState(__DEV__ ? 'Doe' : '');
    const [username, setUsername] = useState(__DEV__ ? 'johndoe' : '');
    const [email, setEmail] = useState(__DEV__ ? 'john.doe@example.com' : '');
    const [password, setPassword] = useState(__DEV__ ? 'Password123!' : '');
    const [confirmPassword, setConfirmPassword] = useState(__DEV__ ? 'Password123!' : '');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }
        setLocalError(null);
        await authViewModel.signUp(firstName, lastName, email, password);
        if (!authViewModel.error) {
            navigation.navigate('Login');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={["top","left","right"]}>
            {/* Back Arrow - always inside safe area, visually separated from top */}
            <View style={{ paddingTop: insets.top + 8, paddingLeft: 8, position: 'absolute', left: 0, top: 0, zIndex: 10 }}>
                <TouchableOpacity onPress={() => navigation.goBack?.()} hitSlop={{ top: 12, left: 12, right: 12, bottom: 12 }}>
                    <Text style={{ fontSize: 28, color: '#22c55e' }}>{'←'}</Text>
                </TouchableOpacity>
            </View>
            <View style={[signUpStyles.container, { paddingTop: insets.top + 40 }]}> {/* Add extra top padding for visual comfort */}
                <Image source={require('../../../assets/appIcons/1024.png')} style={signUpStyles.logo} resizeMode="contain" />
                <View style={signUpStyles.card}>
                    <Text style={signUpStyles.title}>Sign up</Text>
                    <View style={signUpStyles.row}>
                        <TextInput
                            style={[signUpStyles.input, signUpStyles.inputHalf]}
                            placeholder="First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholderTextColor="#a7f3d0"
                        />
                        <TextInput
                            style={[signUpStyles.input, signUpStyles.inputHalf]}
                            placeholder="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                            placeholderTextColor="#a7f3d0"
                        />
                    </View>
                    <TextInput
                        style={signUpStyles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        placeholderTextColor="#a7f3d0"
                    />
                    <TextInput
                        style={signUpStyles.input}
                        placeholder="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholderTextColor="#a7f3d0"
                    />
                    <View style={{ width: '100%', position: 'relative' }}>
                        <TextInput
                            style={signUpStyles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholderTextColor="#a7f3d0"
                        />
                        <Pressable
                            style={{ position: 'absolute', right: 16, top: 18 }}
                            onPress={() => setShowPassword((v) => !v)}
                        >
                            <Text style={{ fontSize: 18, color: '#22c55e' }}>{showPassword ? '🙈' : '👁️'}</Text>
                        </Pressable>
                    </View>
                    <View style={{ width: '100%', position: 'relative' }}>
                        <TextInput
                            style={signUpStyles.input}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            placeholderTextColor="#a7f3d0"
                        />
                        <Pressable
                            style={{ position: 'absolute', right: 16, top: 18 }}
                            onPress={() => setShowConfirmPassword((v) => !v)}
                        >
                            <Text style={{ fontSize: 18, color: '#22c55e' }}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
                        </Pressable>
                    </View>
                    {localError ? (
                        <Text style={signUpStyles.error}>{localError}</Text>
                    ) : authViewModel.error ? (
                        <Text style={signUpStyles.error}>{authViewModel.error}</Text>
                    ) : null}
                    <TouchableOpacity
                        style={signUpStyles.button}
                        onPress={handleSignUp}
                        disabled={authViewModel.isLoading}
                    >
                        {authViewModel.isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={signUpStyles.buttonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>
                    {/* OR Separator */}
                    <View style={signUpStyles.orContainer}>
                        <View style={signUpStyles.orLine} />
                        <Text style={signUpStyles.orText}>OR</Text>
                        <View style={signUpStyles.orLine} />
                    </View>
                    {/* Social Buttons */}
                    <TouchableOpacity style={signUpStyles.socialButton}>
                        <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} style={signUpStyles.socialIcon} />
                        <Text style={signUpStyles.socialText}>Sign in with Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={signUpStyles.socialButton}>
                        <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' }} style={signUpStyles.socialIcon} />
                        <Text style={signUpStyles.socialText}>Sign in with Facebook</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
});

export default SignUpView; 