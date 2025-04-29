import { createStackNavigator } from "@react-navigation/stack";
import { MainStackParamList } from "../types/navigation";
import HomeView from "../views/HomeView";
import CreateActivityView from "../views/CreateActivityView";
import ActivityTrackerView from "../views/ActivityTrackerView";

const MainStack = createStackNavigator<MainStackParamList>();

export function MainNavigator() {
    return (
        <MainStack.Navigator screenOptions={{ headerShown: false }}>
            <MainStack.Screen name="Home" component={HomeView} />
            <MainStack.Screen name="CreateActivity" component={CreateActivityView} />
            <MainStack.Screen name="ActivityTracker" component={ActivityTrackerView} />
        </MainStack.Navigator>
    );
} 