import { Link } from "react-router-dom";
import { ShoppingCart, Search, Menu, User, LogOut, Package, UserCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.jpg";

const categories = [
    "Decor",
    "Paintings",
    "Vases",
    "Cosmetics",
    "Apparel",
    "Jewelry",
    "Bags",
];

export function Navbar() {
    const { itemCount } = useCart();
    const { user, isAuthenticated, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img
                            src={logo}
                            alt="BlingBling Logo"
                            className="h-10 w-10 rounded object-cover"
                        />
                        <span className="text-4xl font-bold text-pink-600 hidden sm:inline-block">
                            BlingBling
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        {categories.slice(0, 5).map((cat) => (
                            <Link
                                key={cat}
                                to={`/shop?category=${cat}`}
                                className="text-gray-600 hover:text-primary transition-colors"
                            >
                                {cat}
                            </Link>
                        ))}
                        <Link to="/shop" className="text-gray-600 hover:text-primary">
                            More
                        </Link>
                    </nav>

                    {/* Search & Actions */}
                    <div className="flex items-center space-x-4">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (searchQuery.trim()) {
                                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                                }
                            }}
                            className="hidden lg:flex relative w-64"
                        >
                            <Input
                                placeholder="Search products..."
                                className="pr-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute right-2.5 top-2.5 cursor-pointer bg-transparent border-0 p-0"
                            >
                                <Search className="h-4 w-4 text-gray-400 hover:text-primary transition-colors" />
                            </button>
                        </form>

                        <Link to="/cart">
                            <Button variant="ghost" size="sm" className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        {/* User Menu */}
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            >
                                <User className="h-5 w-5" />
                            </Button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                    {isAuthenticated ? (
                                        <>
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                                                <p className="text-xs text-gray-500">{user?.email}</p>
                                            </div>
                                            <Link
                                                to="/dashboard/orders"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <Package className="h-4 w-4" />
                                                My Orders
                                            </Link>
                                            <Link
                                                to="/dashboard/profile"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <UserCircle className="h-4 w-4" />
                                                Profile
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                to="/signup"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Sign Up
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 py-4">
                        <nav className="flex flex-col space-y-2">
                            {categories.map((cat) => (
                                <Link
                                    key={cat}
                                    to={`/shop?category=${cat}`}
                                    className="px-2 py-1 text-sm font-medium text-gray-600 hover:text-primary"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {cat}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
