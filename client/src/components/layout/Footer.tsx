import { Link } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">BlingBling</h3>
                        <p className="text-sm text-gray-600">
                            Your one-stop shop for home decor, fashion, and more.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-primary mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-primary">Decor</a></li>
                            <li><a href="#" className="hover:text-primary">Apparel</a></li>
                            <li><a href="#" className="hover:text-primary">New Arrivals</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium text-primary mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
                            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-primary">FAQs</Link></li>
                            <li><a href="#" className="hover:text-primary">Shipping</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium text-primary mb-4">Follow Us</h4>
                        <div className="flex gap-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-primary transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-primary transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a
                                href="https://tiktok.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-primary transition-colors"
                                aria-label="TikTok"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-primary mb-4">Newsletter</h4>
                        <p className="text-sm text-gray-600 mb-2">
                            Subscribe for updates and exclusive offers.
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <button className="rounded-r-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-100 pt-8 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} BlingBling. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
