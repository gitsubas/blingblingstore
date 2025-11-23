import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/public/Home";
import { Shop } from "./pages/public/Shop";
import { ProductDetails } from "./pages/public/ProductDetails";
import { Login } from "./pages/public/Login";
import { Signup } from "./pages/public/Signup";
import { PasswordReset } from "./pages/public/PasswordReset";
import { Checkout } from "./pages/public/Checkout";
import { OrderConfirmation } from "./pages/public/OrderConfirmation";
import { Dashboard } from "./pages/admin/Dashboard";
import { ProductEditor } from "./pages/admin/ProductEditor";
import { UserDashboard } from "./pages/user/UserDashboard";
import { OrderHistory } from "./pages/user/OrderHistory";
import { OrderDetails } from "./pages/user/OrderDetails";
import { UserProfile } from "./pages/user/UserProfile";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
    const { isAuthenticated, isAdmin } = useAuth();

    if (!isAuthenticated) return <Navigate to="/login" />;
    if (adminOnly && !isAdmin) return <Navigate to="/" />;

    return <>{children}</>;
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="password-reset" element={<PasswordReset />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />

                {/* User Dashboard Routes */}
                <Route path="dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/dashboard/orders" />} />
                    <Route path="orders" element={<OrderHistory />} />
                    <Route path="orders/:orderId" element={<OrderDetails />} />
                    <Route path="profile" element={<UserProfile />} />
                </Route>

                {/* Admin Routes */}
                <Route path="admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
                <Route path="admin/products/new" element={<ProtectedRoute adminOnly><ProductEditor /></ProtectedRoute>} />
                <Route path="admin/products/:id" element={<ProtectedRoute adminOnly><ProductEditor /></ProtectedRoute>} />
            </Route>
        </Routes>
    );
}

export default App;
