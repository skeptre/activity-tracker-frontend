
import React from "react";
import SignUpScreen from "@/app/views/signUpScreen";
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