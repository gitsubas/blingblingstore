import { useState } from "react";
import { DataTable, Column } from "../../components/ui/DataTable";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { useOrders } from "../../context/OrdersContext";

interface PaymentRecord {
    orderId: string;
    date: string;
    amount: number;
    method: string;
    transactionId?: string;
    status: string;
}

export function PaymentManagement() {
    const { orders } = useOrders();
    const [searchTerm, setSearchTerm] = useState("");
    const [methodFilter, setMethodFilter] = useState<string>("all");

    // Use empty array as fallback
    const allOrders = orders || [];

    // Transform orders into payment records
    const payments: PaymentRecord[] = allOrders.map((order) => ({
        orderId: order.id,
        date: order.createdAt,
        amount: order.total,
        method: order.paymentMethod,
        transactionId: (order as any).paymentDetails?.transactionId,
        status: order.status,
    }));

    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        const matchesMethod = methodFilter === "all" || payment.method === methodFilter;
        return matchesSearch && matchesMethod;
    });

    // Calculate statistics
    const stats = {
        total: payments.reduce((sum, p) => sum + p.amount, 0),
        byMethod: {
            esewa: payments.filter((p) => p.method === "esewa").reduce((sum, p) => sum + p.amount, 0),
            khalti: payments.filter((p) => p.method === "khalti").reduce((sum, p) => sum + p.amount, 0),
            cod: payments.filter((p) => p.method === "cod").reduce((sum, p) => sum + p.amount, 0),
        },
    };

    const columns: Column<PaymentRecord>[] = [
        {
            key: "orderId",
            header: "Order ID",
            sortable: true,
        },
        {
            key: "date",
            header: "Date",
            sortable: true,
            render: (payment) => new Date(payment.date).toLocaleDateString(),
        },
        {
            key: "amount",
            header: "Amount",
            sortable: true,
            render: (payment) => `Rs. ${payment.amount.toFixed(2)}`,
        },
        {
            key: "method",
            header: "Payment Method",
            sortable: true,
            render: (payment) => (
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 uppercase">
                    {payment.method}
                </span>
            ),
        },
        {
            key: "transactionId",
            header: "Transaction ID",
            render: (payment) => (
                <span className="font-mono text-xs">{payment.transactionId || "N/A"}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            sortable: true,
            render: (payment) => (
                <span
                    className={`px-2 py-1 text-xs rounded-full ${payment.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                >
                    {payment.status}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>

            {/* Payment Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">Rs. {stats.total.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-sm text-gray-600">eSewa</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">Rs. {stats.byMethod.esewa.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-sm text-gray-600">Khalti</p>
                    <p className="text-2xl font-bold text-purple-600 mt-2">Rs. {stats.byMethod.khalti.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-sm text-gray-600">Cash on Delivery</p>
                    <p className="text-2xl font-bold text-orange-600 mt-2">Rs. {stats.byMethod.cod.toFixed(2)}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        placeholder="Search by order ID or transaction ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Select
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                        options={[
                            { value: "all", label: "All Payment Methods" },
                            { value: "esewa", label: "eSewa" },
                            { value: "khalti", label: "Khalti" },
                            { value: "cod", label: "Cash on Delivery" },
                        ]}
                    />
                </div>
            </div>

            {/* Payment Table */}
            <DataTable
                data={filteredPayments}
                columns={columns}
                keyExtractor={(payment) => payment.orderId}
            />
        </div>
    );
}
