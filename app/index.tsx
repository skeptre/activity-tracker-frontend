import { View, Text, ImageBackground } from "react-native";
import React from "react";
import SignUpScreen from "@/app/screens/signUpScreen";
import {AuthProvider} from "@/app/hooks/useAuth";


const App = () => {
    return (
       <AuthProvider>
           <SignUpScreen>

           </SignUpScreen>
       </AuthProvider>
    )
}
export default App