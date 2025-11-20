import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/public/Home";
import { Shop } from "./pages/public/Shop";
import { ProductDetails } from "./pages/public/ProductDetails";
import { Login } from "./pages/public/Login";
import { Cart } from "./pages/public/Cart";
import { Checkout } from "./pages/public/Checkout";
import { Dashboard } from "./pages/admin/Dashboard";
import { ProductEditor } from "./pages/admin/ProductEditor";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAdmin } = useAuth();
    return isAdmin ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="login" element={<Login />} />

                {/* Admin Routes */}
                <Route path="admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="admin/products/new" element={<ProtectedRoute><ProductEditor /></ProtectedRoute>} />
                <Route path="admin/products/:id" element={<ProtectedRoute><ProductEditor /></ProtectedRoute>} />
            </Route>
        </Routes>
    );
}

export default App;
