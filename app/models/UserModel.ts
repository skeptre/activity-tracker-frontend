export interface User {
    firstName: string;
    lastName: string;
    username?: string;  // Optional if not required
    email: string;
    password: string;
}