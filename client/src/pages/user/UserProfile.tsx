import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { User, Mail, Calendar } from "lucide-react";

export function UserProfile() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>

                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-primary-light flex items-center justify-center">
                            <User className="h-10 w-10 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">{user.username}</h3>
                            <p className="text-gray-500">{user.role === "admin" ? "Administrator" : "Customer"}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium text-gray-900">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Member Since</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <Button variant="outline" className="w-full sm:w-auto" onClick={logout}>
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
