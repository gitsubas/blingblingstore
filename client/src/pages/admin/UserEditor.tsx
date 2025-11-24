import { useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { useAuth } from "../../context/AuthContext";

export function UserEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getAllUsers, createUser, updateUser } = useAuth();
    const isEditing = !!id;

    const user = isEditing ? getAllUsers().find((u) => u.id === id) : null;

    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "",
        password: "",
        role: user?.role || "user",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validation
        const newErrors: Record<string, string> = {};
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!isEditing && !formData.password.trim()) newErrors.password = "Password is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (isEditing && user) {
            // Update existing user
            const success = updateUser(user.id, {
                username: formData.username,
                email: formData.email,
                role: formData.role as "user" | "admin",
            });

            if (success) {
                navigate("/admin/users");
            } else {
                alert("Failed to update user");
            }
        } else {
            // Create new user
            const success = createUser(
                formData.username,
                formData.email,
                formData.password,
                formData.role as "user" | "admin"
            );

            if (success) {
                navigate("/admin/users");
            } else {
                alert("Failed to create user. Email may already exist.");
            }
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {isEditing ? "Edit User" : "Create New User"}
            </h1>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        error={errors.username}
                        required
                    />

                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        error={errors.email}
                        required
                    />

                    {!isEditing && (
                        <Input
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            error={errors.password}
                            required
                        />
                    )}

                    <Select
                        label="Role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as "user" | "admin" })}
                        options={[
                            { value: "user", label: "User" },
                            { value: "admin", label: "Admin" },
                        ]}
                    />

                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/admin/users")}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">{isEditing ? "Update User" : "Create User"}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
