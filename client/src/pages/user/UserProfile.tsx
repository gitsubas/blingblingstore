import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { User, Mail, Calendar, MapPin, Camera, Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { Address } from "../../types/Address";

export function UserProfile() {
    const { user, logout, updateUser, changePassword } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<"profile" | "security" | "address">("profile");

    // Profile Form State
    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "",
    });

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Address Form State
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        isDefault: false,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!user) return null;

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        const success = updateUser(user.id, formData);
        if (success) {
            setIsEditing(false);
            alert("Profile updated successfully!");
        } else {
            alert("Failed to update profile.");
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match.");
            return;
        }

        // In a real app, we would verify currentPassword first.
        // Since we don't have a backend endpoint to verify just the password without logging in,
        // and our mock changePassword doesn't check current password (it just overwrites),
        // we will proceed. In a real scenario, the backend would handle this check.

        const success = await changePassword(passwordData.newPassword);
        if (success) {
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            alert("Password changed successfully!");
        } else {
            alert("Failed to change password.");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                updateUser(user.id, { profilePicture: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddAddress = (e: React.FormEvent) => {
        e.preventDefault();
        const address: Address = {
            ...newAddress,
            id: Date.now().toString(),
        };

        const currentAddresses = user.shippingAddresses || [];
        // If this is the first address, make it default
        if (currentAddresses.length === 0) {
            address.isDefault = true;
        }

        const updatedAddresses = [...currentAddresses, address];
        updateUser(user.id, { shippingAddresses: updatedAddresses });
        setIsAddingAddress(false);
        setNewAddress({
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            isDefault: false,
        });
    };

    const handleDeleteAddress = (addressId: string) => {
        const currentAddresses = user.shippingAddresses || [];
        const updatedAddresses = currentAddresses.filter(a => a.id !== addressId);
        updateUser(user.id, { shippingAddresses: updatedAddresses });
    };

    const handleSetDefaultAddress = (addressId: string) => {
        const currentAddresses = user.shippingAddresses || [];
        const updatedAddresses = currentAddresses.map(a => ({
            ...a,
            isDefault: a.id === addressId,
        }));
        updateUser(user.id, { shippingAddresses: updatedAddresses });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group">
                            <div className="h-24 w-24 rounded-full bg-primary-light flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                                {user.profilePicture ? (
                                    <img src={user.profilePicture} alt={user.username} className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-12 w-12 text-primary" />
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <Camera className="h-4 w-4 text-gray-600" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                            <p className="text-gray-500">{user.email}</p>
                            <p className="text-sm text-primary font-medium mt-1 capitalize">{user.role}</p>
                        </div>
                        <Button variant="outline" onClick={logout}>
                            Sign Out
                        </Button>
                    </div>
                </div>

                <div className="flex border-b border-gray-200 overflow-x-auto">
                    <button
                        className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${activeTab === "profile" ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("profile")}
                    >
                        Profile Details
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${activeTab === "security" ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("security")}
                    >
                        Security
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${activeTab === "address" ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("address")}
                    >
                        Shipping Addresses
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === "profile" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                                {!isEditing && (
                                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                )}
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleProfileUpdate} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                        <Input
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <Button type="submit">
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-3">
                                        <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Username</p>
                                            <p className="font-medium text-gray-900">{user.username}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium text-gray-900">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
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
                            )}
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                            <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <Input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <Input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <Input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                <Button type="submit">
                                    Update Password
                                </Button>
                            </form>
                        </div>
                    )}

                    {activeTab === "address" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">Saved Addresses</h3>
                                {!isAddingAddress && (
                                    <Button size="sm" onClick={() => setIsAddingAddress(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add New Address
                                    </Button>
                                )}
                            </div>

                            {isAddingAddress && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                                    <h4 className="font-medium text-gray-900 mb-4">New Address</h4>
                                    <form onSubmit={handleAddAddress} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                                <Input
                                                    value={newAddress.street}
                                                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                <Input
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                                                <Input
                                                    value={newAddress.state}
                                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                                                <Input
                                                    value={newAddress.zipCode}
                                                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                                <Input
                                                    value={newAddress.country}
                                                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button type="submit">Save Address</Button>
                                            <Button type="button" variant="outline" onClick={() => setIsAddingAddress(false)}>Cancel</Button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user.shippingAddresses?.map((address) => (
                                    <div key={address.id} className={`relative p-4 rounded-lg border ${address.isDefault ? 'border-primary bg-primary-light/10' : 'border-gray-200 hover:border-gray-300'}`}>
                                        {address.isDefault && (
                                            <span className="absolute top-2 right-2 px-2 py-1 bg-primary text-white text-xs rounded-full">Default</span>
                                        )}
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-900">{address.street}</p>
                                                <p className="text-sm text-gray-500">{address.city}, {address.state} {address.zipCode}</p>
                                                <p className="text-sm text-gray-500">{address.country}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            {!address.isDefault && (
                                                <button
                                                    onClick={() => handleSetDefaultAddress(address.id)}
                                                    className="text-xs text-primary hover:text-primary-dark font-medium"
                                                >
                                                    Set as Default
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteAddress(address.id)}
                                                className="text-xs text-red-600 hover:text-red-700 font-medium ml-auto"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!user.shippingAddresses || user.shippingAddresses.length === 0) && !isAddingAddress && (
                                    <div className="col-span-full text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        No addresses saved yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
