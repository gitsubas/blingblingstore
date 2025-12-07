import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/public/Home";
import { Shop } from "./pages/public/Shop";
import { ProductDetails } from "./pages/public/ProductDetails";
import { Cart } from "./pages/public/Cart";
import { Login } from "./pages/public/Login";
import { Signup } from "./pages/public/Signup";
import { PasswordReset } from "./pages/public/PasswordReset";
import { Checkout } from "./pages/public/Checkout";
import { OrderConfirmation } from "./pages/public/OrderConfirmation";
import { About } from "./pages/public/About";
import { Contact } from "./pages/public/Contact";
import { NotFound } from "./pages/public/NotFound";
import { Dashboard } from "./pages/admin/Dashboard";
import { ProductEditor } from "./pages/admin/ProductEditor";
import { ProductManagement } from "./pages/admin/ProductManagement";
import { UserManagement } from "./pages/admin/UserManagement";
import { UserEditor } from "./pages/admin/UserEditor";
import { OrderManagement } from "./pages/admin/OrderManagement";
import { OrderDetailAdmin } from "./pages/admin/OrderDetailAdmin";
import { PaymentManagement } from "./pages/admin/PaymentManagement";
import { AdminLayout } from "./components/admin/AdminLayout";
import { UserDashboard } from "./pages/user/UserDashboard";
import { OrderHistory } from "./pages/user/OrderHistory";
import { OrderDetails } from "./pages/user/OrderDetails";
import { UserProfile } from "./pages/user/UserProfile";
import { Wishlist } from "./pages/user/Wishlist";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
    const { isAuthenticated, isAdmin } = useAuth();

    // Fallback to localStorage check for immediate auth state after login
    const savedUser = localStorage.getItem("currentUser");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const isAuthenticatedFallback = !!user;
    const isAdminFallback = user?.role === "admin";

    const authenticated = isAuthenticated || isAuthenticatedFallback;
    const admin = isAdmin || isAdminFallback;

    if (!authenticated) return <Navigate to="/login" />;
    if (adminOnly && !admin) return <Navigate to="/" />;

    return <>{children}</>;
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="cart" element={<Cart />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="password-reset" element={<PasswordReset />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />

                {/* User Dashboard Routes */}
                <Route path="dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/dashboard/orders" />} />
                    <Route path="orders" element={<OrderHistory />} />
                    <Route path="orders/:orderId" element={<OrderDetails />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="profile" element={<UserProfile />} />
                </Route>
            </Route>

            {/* Admin Routes with AdminLayout */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute adminOnly>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="users/new" element={<UserEditor />} />
                <Route path="users/:id" element={<UserEditor />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="orders/:orderId" element={<OrderDetailAdmin />} />
                <Route path="payments" element={<PaymentManagement />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="products/new" element={<ProductEditor />} />
                <Route path="products/:id" element={<ProductEditor />} />
            </Route>
        </Routes>
    );
}

export default App;

