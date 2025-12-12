import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Address } from "../types/Address";
import { authService } from "../services/api";

export interface User {
    id: string;
    name: string;
    email: string;
    role: "CUSTOMER" | "ADMIN";
    profilePicture?: string;
    addresses?: Address[];
    createdAt?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string, redirectTo?: string | null) => Promise<boolean>;
    signup: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    resetPassword: (email: string) => Promise<boolean>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
    updateProfile: (data: { name?: string; email?: string; profilePicture?: string; addresses?: Address[] }) => Promise<boolean>;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Initialize user from localStorage on mount
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem("token");
            const savedUser = localStorage.getItem("user");

            if (token && savedUser) {
                try {
                    // Verify token is still valid by fetching current user
                    const { user } = await authService.getMe();
                    setUser(user);
                    localStorage.setItem("user", JSON.stringify(user)); // Update with fresh data
                } catch (error) {
                    // Token invalid or expired, clear everything
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setUser(null);
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const signup = async (name: string, email: string, password: string): Promise<boolean> => {
        try {
            const { user, token } = await authService.register({ name, email, password });

            // Store token and user
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);

            return true;
        } catch (error: any) {
            console.error("Signup failed:", error);
            return false;
        }
    };

    const login = async (email: string, password: string, redirectTo?: string | null): Promise<boolean> => {
        try {
            const { user, token } = await authService.login(email, password);

            // Store token and user
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);

            // Navigate if no redirect specified
            if (!redirectTo) {
                setTimeout(() => navigate(user.role === "ADMIN" ? "/admin" : "/"), 0);
            }

            return true;
        } catch (error: any) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logout = () => {
        // Clear token and user
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    const resetPassword = async (email: string): Promise<boolean> => {
        // This would typically call a password reset endpoint
        // For now, just return true as a placeholder
        console.log("Password reset requested for:", email);
        // In production: await authService.requestPasswordReset(email);
        return true;
    };

    const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
        try {
            await authService.changePassword(oldPassword, newPassword);
            return true;
        } catch (error: any) {
            console.error("Password change failed:", error);
            return false;
        }
    };

    const updateProfile = async (data: { name?: string; email?: string; profilePicture?: string; addresses?: Address[] }): Promise<boolean> => {
        try {
            const { user: updatedUser } = await authService.updateProfile(data);

            // Update local storage and state
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);

            return true;
        } catch (error: any) {
            console.error("Profile update failed:", error);
            return false;
        }
    };

    const refreshUser = async (): Promise<void> => {
        try {
            const { user } = await authService.getMe();
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);
        } catch (error) {
            // Token invalid, logout
            logout();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout,
                resetPassword,
                changePassword,
                updateProfile,
                refreshUser,
                isAuthenticated: !!user,
                get isAdmin() {
                    return user?.role === "ADMIN";
                },
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
