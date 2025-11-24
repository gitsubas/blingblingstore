import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    variant?: "blue" | "green" | "purple" | "orange";
}

export function StatsCard({ title, value, icon: Icon, trend, variant = "blue" }: StatsCardProps) {
    const variantClasses = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
                    {trend && (
                        <p className={`text-sm mt-2 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${variantClasses[variant]}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}
