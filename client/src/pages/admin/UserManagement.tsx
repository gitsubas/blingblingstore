import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Shield, ShieldOff } from "lucide-react";
import { DataTable, Column } from "../../components/ui/DataTable";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { User } from "../../context/AuthContext";
import { adminService } from "../../services/api";

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | "CUSTOMER" | "ADMIN">("all");
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId?: string; username?: string }>({
        isOpen: false,
    });

    // Fetch users on mount
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const { users: fetchedUsers } = await adminService.getUsers();
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleDelete = async () => {
        if (deleteModal.userId) {
            try {
                await adminService.deleteUser(deleteModal.userId);
                setDeleteModal({ isOpen: false });
                await loadUsers(); // Refresh list
            } catch (error) {
                alert("Cannot delete this user");
            }
        }
    };

    const handleToggleRole = async (userId: string, currentRole: "CUSTOMER" | "ADMIN") => {
        const newRole = currentRole === "ADMIN" ? "CUSTOMER" : "ADMIN";
        try {
            await adminService.updateUserRole(userId, newRole);
            await loadUsers(); // Refresh list
        } catch (error) {
            alert("Cannot change user role");
        }
    };

    const columns: Column<User>[] = [
        {
            key: "name",
            header: "Name",
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
                        onChange={(e) => setRoleFilter(e.target.value as "all" | "CUSTOMER" | "ADMIN")}
                        options={[
                            { value: "all", label: "All Roles" },
                            { value: "CUSTOMER", label: "Customers" },
                            { value: "ADMIN", label: "Admins" },
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
                            title={user.role === "ADMIN" ? "Demote to Customer" : "Promote to Admin"}
                        >
                            {user.role === "ADMIN" ? (
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
                            onClick={() => setDeleteModal({ isOpen: true, userId: user.id, username: user.name })}
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
