import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface User {
    id: string;
    username: string;
    email: string;
    role: "user" | "admin";
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (username: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    resetPassword: (email: string) => Promise<boolean>;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const signup = async (username: string, email: string, password: string): Promise<boolean> => {
        // Get existing users
        const usersData = localStorage.getItem("users");
        const users = usersData ? JSON.parse(usersData) : [];

        // Check if email already exists
        if (users.some((u: any) => u.email === email)) {
            return false;
        }

        // Create new user
        const newUser: User = {
            id: Date.now().toString(),
            username,
            email,
            role: "user",
            createdAt: new Date().toISOString(),
        };

        // Store password separately (in production, this would be hashed on backend)
        const userCredentials = {
            email,
            password, // In production: hash this!
            userId: newUser.id,
        };

        users.push(newUser);
        const credentials = usersData ? JSON.parse(localStorage.getItem("userCredentials") || "[]") : [];
        credentials.push(userCredentials);

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("userCredentials", JSON.stringify(credentials));

        return true;
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        // Handle admin login
        if (email === "admin" && password === "admin") {
            const adminUser: User = {
                id: "admin",
                username: "Admin",
                email: "admin@store.com",
                role: "admin",
                createdAt: new Date().toISOString(),
            };
            setUser(adminUser);
            localStorage.setItem("currentUser", JSON.stringify(adminUser));
            navigate("/admin");
            return true;
        }

        // Handle regular user login
        const credentials = JSON.parse(localStorage.getItem("userCredentials") || "[]");
        const userCred = credentials.find((c: any) => c.email === email && c.password === password);

        if (userCred) {
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const foundUser = users.find((u: User) => u.id === userCred.userId);

            if (foundUser) {
                setUser(foundUser);
                localStorage.setItem("currentUser", JSON.stringify(foundUser));
                navigate("/");
                return true;
            }
        }

        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("currentUser");
        navigate("/");
    };

    const resetPassword = async (email: string): Promise<boolean> => {
        // Mock password reset - in production, this would send an email
        const credentials = JSON.parse(localStorage.getItem("userCredentials") || "[]");
        const userExists = credentials.some((c: any) => c.email === email);
        return userExists;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                signup,
                logout,
                resetPassword,
                isAuthenticated: !!user,
                isAdmin: user?.role === "admin",
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
