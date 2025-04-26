import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/app/types/navigation';
import InputField from '@/app/components/InputField';
import SocialLoginButton from '@/app/components/SocialLoginButton';
import { styles } from '@/app/styles/signUpStyles';
import { Ionicons } from '@expo/vector-icons';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

export default function SignUpScreen() {
    const navigation = useNavigation<SignUpScreenNavigationProp>();
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSignUp = () => {
        // TODO: Implement sign up logic
        console.log('Sign up:', form);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.navigate('Login')}
            >
                <Ionicons name="arrow-back" style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <View style={styles.formContainer}>
                <InputField
                    placeholder="Full Name"
                    value={form.fullName}
                    onChangeText={(text) => setForm({ ...form, fullName: text })}
                />
                <InputField
                    placeholder="Email"
                    keyboardType="email-address"
                    value={form.email}
                    onChangeText={(text) => setForm({ ...form, email: text })}
                />
                <InputField
                    placeholder="Password"
                    secureTextEntry
                    value={form.password}
                    onChangeText={(text) => setForm({ ...form, password: text })}
                />
                <InputField
                    placeholder="Confirm Password"
                    secureTextEntry
                    value={form.confirmPassword}
                    onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
                />
                <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                    <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>
                <Text style={styles.loginText}>
                    Already have an account?{' '}
                    <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                        Log in
                    </Text>
                </Text>
                <View style={styles.orContainer}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.line} />
                </View>
                <View style={styles.socialButtonsContainer}>
                    <SocialLoginButton platform="google" text="Sign up with Google" />
                    <SocialLoginButton platform="facebook" text="Sign up with Facebook" />
                </View>
            </View>
        </ScrollView>
    );
} 