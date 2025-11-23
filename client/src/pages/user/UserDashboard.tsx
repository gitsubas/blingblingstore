import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Package, User as UserIcon, Star } from "lucide-react";
import { cn } from "../../lib/utils";

const tabs = [
    { name: "Orders", icon: Package, href: "/dashboard/orders" },
    { name: "Profile", icon: UserIcon, href: "/dashboard/profile" },
    { name: "Reviews", icon: Star, href: "/dashboard/reviews" },
];

export function UserDashboard() {
    const { user } = useAuth();
    const location = useLocation();

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = location.pathname === tab.href || location.pathname.startsWith(tab.href + "/");
                        return (
                            <Link
                                key={tab.name}
                                to={tab.href}
                                className={cn(
                                    "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm",
                                    isActive
                                        ? "border-primary text-primary"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "mr-2 h-5 w-5",
                                        isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500"
                                    )}
                                />
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Content */}
            <Outlet />
        </div>
    );
}
