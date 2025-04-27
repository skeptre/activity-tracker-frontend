import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { observer } from 'mobx-react-lite';
import { AuthNavigator } from "@/app/features/auth/navigation/AuthNavigator";
import { MainNavigator } from "@/app/features/home/navigation/MainNavigator";
import { authViewModel } from "@/app/features/auth/viewModels/AuthViewModel";
import Loader from "@/app/components/Loader";
import { RootStackParamList } from "@/app/types/navigation";

const RootStack = createStackNavigator<RootStackParamList>();

const AppNavigator = observer(() => {
    if (authViewModel.isLoading) {
        return <Loader />;
    }

    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                {authViewModel.user ? (
                    <RootStack.Screen name="Main" component={MainNavigator} />
                ) : (
                    <RootStack.Screen name="Auth" component={AuthNavigator} />
                )}
            </RootStack.Navigator>
        </NavigationContainer>
    );
});

export default AppNavigator;