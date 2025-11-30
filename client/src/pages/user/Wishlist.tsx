import { useWishlist } from "../../context/WishlistContext";
import { ProductCard } from "../../components/ui/ProductCard";
import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";

export function Wishlist() {
    const { wishlist, clearWishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h2>
                <p className="text-gray-600 mb-8">Start adding items you love to your wishlist!</p>
                <Link to="/shop">
                    <Button>Browse Products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">My Wishlist ({wishlist.length})</h1>
                <Button variant="outline" onClick={clearWishlist}>
                    Clear Wishlist
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
