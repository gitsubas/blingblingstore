import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { AlertCircle, Home, ShoppingBag } from "lucide-react";

export function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="bg-red-50 p-6 rounded-full mb-6">
                <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p className="text-gray-500 max-w-md mb-8">
                Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/">
                    <Button size="lg" className="w-full sm:w-auto">
                        <Home className="mr-2 h-4 w-4" />
                        Go Home
                    </Button>
                </Link>
                <Link to="/shop">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        </div>
    );
}
