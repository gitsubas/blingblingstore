import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import { DataTable, Column } from "../../components/ui/DataTable";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { useOrders, Order } from "../../context/OrdersContext";

export function OrderManagement() {
    const { orders, cancelOrder } = useOrders();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; orderId?: string }>({
        isOpen: false,
    });

    // Use empty array as fallback
    const allOrders = orders || [];

    const filteredOrders = allOrders.filter((order) => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = async () => {
        if (deleteModal.orderId) {
            await cancelOrder(deleteModal.orderId);
            setDeleteModal({ isOpen: false });
        }
    };

    const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
        // Note: updateOrderStatus doesn't exist in context
        // For now, this is a placeholder - admin would need backend API to update order status
        console.log(`Update order ${orderId} to status: ${newStatus}`);
    };

    const columns: Column<Order>[] = [
        {
            key: "id",
            header: "Order ID",
            sortable: true,
        },
        {
            key: "createdAt",
            header: "Date",
            sortable: true,
            render: (order) => new Date(order.createdAt).toLocaleDateString(),
        },
        {
            key: "total",
            header: "Total",
            sortable: true,
            render: (order) => `Rs. ${order.total.toFixed(2)}`,
        },
        {
            key: "paymentMethod",
            header: "Payment",
            render: (order) => order.paymentMethod.toUpperCase(),
        },
        {
            key: "status",
            header: "Status",
            sortable: true,
            render: (order) => (
                <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                    className="px-2 py-1 text-xs rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="returned">Returned</option>
                </select>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        placeholder="Search by order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={[
                            { value: "all", label: "All Status" },
                            { value: "pending", label: "Pending" },
                            { value: "processing", label: "Processing" },
                            { value: "shipped", label: "Shipped" },
                            { value: "delivered", label: "Delivered" },
                            { value: "returned", label: "Returned" },
                        ]}
                    />
                </div>
            </div>

            {/* Order Table */}
            <DataTable
                data={filteredOrders}
                columns={columns}
                keyExtractor={(order) => order.id}
                actions={(order) => (
                    <>
                        <Link to={`/admin/orders/${order.id}`}>
                            <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteModal({ isOpen: true, orderId: order.id })}
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
                title="Delete Order"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Are you sure you want to delete this order? This action cannot be undone.
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
