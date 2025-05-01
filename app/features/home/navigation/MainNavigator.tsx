import { createStackNavigator } from "@react-navigation/stack";
import { MainStackParamList } from "../types/navigation";
import HomeView from "../views/HomeView";
import CreateActivityView from "../views/CreateActivityView";
import ActivityTrackerView from "../views/ActivityTrackerView";
import SettingsView from "../views/SettingsView";
import ProfileView from "../views/ProfileView";
import WorkoutsView from "../views/WorkoutsView";
import WorkoutDetailsView from "../views/WorkoutDetailsView";
import AddWorkoutView from "../views/AddWorkoutView";
import EditProfileView from "../views/EditProfileView";

const MainStack = createStackNavigator<MainStackParamList>();

export function MainNavigator() {
    return (
        <MainStack.Navigator screenOptions={{ headerShown: false }}>
            <MainStack.Screen name="Home" component={HomeView} />
            <MainStack.Screen name="CreateActivity" component={CreateActivityView} />
            <MainStack.Screen name="ActivityTracker" component={ActivityTrackerView} />
            <MainStack.Screen name="Settings" component={SettingsView} />
            <MainStack.Screen name="Profile" component={ProfileView} />
            <MainStack.Screen name="Workouts" component={WorkoutsView} />
            <MainStack.Screen name="WorkoutDetails" component={WorkoutDetailsView} />
            <MainStack.Screen name="AddWorkout" component={AddWorkoutView} />
            <MainStack.Screen name="EditProfile" component={EditProfileView} />
        </MainStack.Navigator>
    );
} 