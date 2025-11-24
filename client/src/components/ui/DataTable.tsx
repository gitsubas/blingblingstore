import React, { useState } from "react";
import { ArrowUpDown } from "lucide-react";

export interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string;
    actions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    keyExtractor,
    actions,
}: DataTableProps<T>) {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

    const handleSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedData = React.useMemo(() => {
        if (!sortConfig) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    return (
        <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key} className="px-6 py-3">
                                {column.sortable ? (
                                    <button
                                        onClick={() => handleSort(column.key)}
                                        className="flex items-center space-x-1 hover:text-gray-900"
                                    >
                                        <span>{column.header}</span>
                                        <ArrowUpDown className="h-3 w-3" />
                                    </button>
                                ) : (
                                    column.header
                                )}
                            </th>
                        ))}
                        {actions && <th className="px-6 py-3 text-right">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((item) => (
                        <tr
                            key={keyExtractor(item)}
                            className="bg-white border-b border-gray-100 hover:bg-gray-50"
                        >
                            {columns.map((column) => (
                                <td key={column.key} className="px-6 py-4">
                                    {column.render ? column.render(item) : item[column.key]}
                                </td>
                            ))}
                            {actions && (
                                <td className="px-6 py-4 text-right space-x-2">
                                    {actions(item)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {sortedData.length === 0 && (
                <div className="text-center py-8 text-gray-500">No data available</div>
            )}
        </div>
    );
}
