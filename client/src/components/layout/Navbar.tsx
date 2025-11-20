import { Link } from "react-router-dom";
import { ShoppingCart, Search, Menu, User } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                        <div className="hidden lg:flex relative w-64">
                            <Input
                                placeholder="Search products..."
                                className="pr-8"
                            />
                            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        </div>

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

                        <Link to="/login">
                            <Button variant="ghost" size="sm">
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>

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
