import { StyleSheet } from 'react-native';
import { Colors } from '@/app/constants/Colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 24,
    },
    backButton: {
        marginTop: 40,
        marginBottom: 16,
    },
    backIcon: {
        fontSize: 28,
        color: Colors.textPrimary,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 32,
        textAlign: 'center',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 20,
    },
    signUpButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 16,
        shadowColor: Colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    signUpText: {
        color: Colors.background,
        fontSize: 16,
        fontWeight: '600',
    },
    loginText: {
        textAlign: 'center',
        marginVertical: 16,
        color: Colors.textSecondary,
        fontSize: 14,
    },
    loginLink: {
        color: Colors.primary,
        fontWeight: '600',
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
        paddingHorizontal: 20,
    },
    orText: {
        marginHorizontal: 12,
        color: Colors.textSecondary,
        fontSize: 14,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
    socialButtonsContainer: {
        gap: 12,
        paddingHorizontal: 20,
    },
});