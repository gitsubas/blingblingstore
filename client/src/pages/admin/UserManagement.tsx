import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Shield, ShieldOff } from "lucide-react";
import { DataTable, Column } from "../../components/ui/DataTable";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { useAuth, User } from "../../context/AuthContext";

export function UserManagement() {
    const { getAllUsers, deleteUser, updateUserRole } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId?: string; username?: string }>({
        isOpen: false,
    });

    const users = getAllUsers();

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleDelete = () => {
        if (deleteModal.userId) {
            const success = deleteUser(deleteModal.userId);
            if (success) {
                setDeleteModal({ isOpen: false });
            } else {
                alert("Cannot delete this user");
            }
        }
    };

    const handleToggleRole = (userId: string, currentRole: "user" | "admin") => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        const success = updateUserRole(userId, newRole);
        if (!success) {
            alert("Cannot change user role");
        }
    };

    const columns: Column<User>[] = [
        {
            key: "username",
            header: "Username",
            sortable: true,
        },
        {
            key: "email",
            header: "Email",
            sortable: true,
        },
        {
            key: "role",
            header: "Role",
            sortable: true,
            render: (user) => (
                <span
                    className={`px-2 py-1 text-xs rounded-full ${user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                        }`}
                >
                    {user.role}
                </span>
            ),
        },
        {
            key: "createdAt",
            header: "Joined",
            sortable: true,
            render: (user) => new Date(user.createdAt).toLocaleDateString(),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <Link to="/admin/users/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        placeholder="Search by username or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as "all" | "user" | "admin")}
                        options={[
                            { value: "all", label: "All Roles" },
                            { value: "user", label: "Users" },
                            { value: "admin", label: "Admins" },
                        ]}
                    />
                </div>
            </div>

            {/* User Table */}
            <DataTable
                data={filteredUsers}
                columns={columns}
                keyExtractor={(user) => user.id}
                actions={(user) => (
                    <>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleRole(user.id, user.role)}
                            title={user.role === "admin" ? "Demote to User" : "Promote to Admin"}
                        >
                            {user.role === "admin" ? (
                                <ShieldOff className="h-4 w-4 text-orange-600" />
                            ) : (
                                <Shield className="h-4 w-4 text-purple-600" />
                            )}
                        </Button>
                        <Link to={`/admin/users/${user.id}`}>
                            <Button variant="ghost" size="sm">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteModal({ isOpen: true, userId: user.id, username: user.username })}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </>
                )}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false })}
                title="Delete User"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Are you sure you want to delete user <strong>{deleteModal.username}</strong>? This action cannot be
                        undone.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false })}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
