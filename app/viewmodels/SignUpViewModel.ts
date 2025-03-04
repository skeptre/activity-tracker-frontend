import { useState } from "react";

export function SignUpViewModel() {
    const [loading, setLoading] = useState(false);

    const signUp = async (form: any) => {
        if (!form.email || !form.password || !form.firstName || !form.lastName) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            // Simulated API Call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            alert("Account created successfully!");
        } catch (error) {
            alert("Signup failed. Try again!");
        } finally {
            setLoading(false);
        }
    };

    return { signUp, loading };
}