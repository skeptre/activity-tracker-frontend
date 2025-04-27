import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, Pressable } from 'react-native';
import { observer } from 'mobx-react-lite';
import { authViewModel } from '../viewModels/AuthViewModel';
import { loginStyles } from '../styles/loginStyles';
// You can use a vector icon library for better icons, here we use emoji for simplicity

const LoginView = observer(({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        await authViewModel.login(email, password);
    };

    return (
        <View style={loginStyles.container}>
            {/* Back Arrow */}
            <TouchableOpacity style={loginStyles.backArrow} onPress={() => navigation.goBack?.()}>
                <Text style={{ fontSize: 24, color: '#14532d' }}>{'←'}</Text>
            </TouchableOpacity>
            {/* Logo (optional, can remove if not needed) */}
            <Image source={require('../../../assets/appIcons/1024.png')} style={loginStyles.logo} resizeMode="contain" />
            <View style={loginStyles.card}>
                <Text style={loginStyles.title}>Sign in</Text>
                <TextInput
                    style={loginStyles.input}
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor="#a7f3d0"
                />
                <View style={{ width: '100%', position: 'relative' }}>
                    <TextInput
                        style={loginStyles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#a7f3d0"
                    />
                    <Pressable
                        style={{ position: 'absolute', right: 16, top: 12 }}
                        onPress={() => setShowPassword((v) => !v)}
                    >
                        <Text style={{ fontSize: 18, color: '#14532d' }}>{showPassword ? '🙈' : '👁️'}</Text>
                    </Pressable>
                </View>
                <TouchableOpacity onPress={() => {}} style={{ alignSelf: 'flex-start', marginBottom: 8 }}>
                    <Text style={{ color: '#22c55e', fontWeight: '600' }}>Forgot Password?</Text>
                </TouchableOpacity>
                {authViewModel.error && (
                    <Text style={loginStyles.error}>{authViewModel.error}</Text>
                )}
                <TouchableOpacity
                    style={loginStyles.button}
                    onPress={handleLogin}
                    disabled={authViewModel.isLoading}
                >
                    <Text style={loginStyles.buttonText}>
                        {authViewModel.isLoading ? 'Loading...' : 'Log in'}
                    </Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 8 }}>
                    <Text style={{ color: '#6b7280' }}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={{ color: '#22c55e', fontWeight: '700' }}>Sign up</Text>
                    </TouchableOpacity>
                </View>
                {/* OR Separator */}
                <View style={loginStyles.orContainer}>
                    <View style={loginStyles.orLine} />
                    <Text style={loginStyles.orText}>OR</Text>
                    <View style={loginStyles.orLine} />
                </View>
                {/* Social Buttons */}
                <TouchableOpacity style={loginStyles.socialButton}>
                    <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} style={loginStyles.socialIcon} />
                    <Text style={loginStyles.socialText}>Sign in with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={loginStyles.socialButton}>
                    <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' }} style={loginStyles.socialIcon} />
                    <Text style={loginStyles.socialText}>Sign in with Facebook</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

export default LoginView; 