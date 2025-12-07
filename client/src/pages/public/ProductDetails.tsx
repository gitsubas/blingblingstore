import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Heart } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductsContext";
import { useWishlist } from "../../context/WishlistContext";
import { useRecentlyViewed } from "../../context/RecentlyViewedContext";
import { ProductReviews } from "../../components/product/ProductReviews";
import { ProductCard } from "../../components/ui/ProductCard";

export function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { products } = useProducts();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToRecentlyViewed, recentlyViewed } = useRecentlyViewed();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});

    const product = products.find((p) => p.id === id);

    useEffect(() => {
        if (product) {
            addToRecentlyViewed(product);

            // Initialize selected attributes with first values
            if (product.attributes && product.attributes.length > 0 && Object.keys(selectedAttributes).length === 0) {
                const defaults: { [key: string]: string } = {};
                product.attributes.forEach(attr => {
                    if (attr.values.length > 0) {
                        defaults[attr.name] = attr.values[0];
                    }
                });
                setSelectedAttributes(defaults);
            }
        }
    }, [product, id]); // Add to history when product changes

    // Variant Logic
    const selectedVariant = product?.variants?.find(v => {
        return Object.entries(v.attributes).every(([key, val]) => selectedAttributes[key] === val);
    });

    // Stock status logic
    const currentPrice = selectedVariant ? selectedVariant.price : (product?.price ?? 0);
    const stock = selectedVariant ? selectedVariant.stock : (product?.stock ?? Infinity);
    const lowStockThreshold = product?.lowStockThreshold ?? 5;
    const isOutOfStock = stock === 0;
    const isLowStock = stock > 0 && stock <= lowStockThreshold;

    if (!product) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
                <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate("/shop")}
                >
                    Back to Shop
                </Button>
            </div>
        );
    }

    // "You May Also Like" Logic
    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    // "Recently Viewed" Logic - Exclude current product from display
    const recentlyViewedDisplay = recentlyViewed
        .filter(p => p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="max-w-6xl mx-auto space-y-16">
            <div>
                <Button
                    variant="ghost"
                    className="mb-8 pl-0 hover:bg-transparent hover:text-primary"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image Display */}
                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                            <img
                                src={product.images && product.images.length > 0
                                    ? product.images[selectedImageIndex]
                                    : product.image}
                                alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Thumbnail Gallery - Only show if multiple images */}
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                            ? 'border-primary shadow-lg scale-105'
                                            : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                                            }`}
                                        aria-label={`View image ${index + 1}`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name} thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div>
                            <Badge variant="secondary" className="mb-4">
                                {product.category}
                            </Badge>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>
                            <p className="text-xl text-primary font-bold">
                                Rs. {currentPrice.toFixed(2)}
                            </p>

                            {/* Attribute Selection */}
                            {product.attributes && product.attributes.length > 0 && (
                                <div className="space-y-4 mt-6">
                                    {product.attributes.map((attr) => (
                                        <div key={attr.name} className="space-y-2">
                                            <label className="text-sm font-medium text-gray-900">
                                                {attr.name}: <span className="text-gray-500">{selectedAttributes[attr.name]}</span>
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {attr.values.map((value) => {
                                                    const isSelected = selectedAttributes[attr.name] === value;
                                                    return (
                                                        <button
                                                            key={value}
                                                            onClick={() => setSelectedAttributes(prev => ({ ...prev, [attr.name]: value }))}
                                                            className={`px-4 py-2 rounded-md text-sm border transition-all ${isSelected
                                                                    ? "border-primary bg-primary/5 text-primary font-medium"
                                                                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                                                                }`}
                                                        >
                                                            {value}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Stock Status Display */}
                            <div className="mt-4">
                                {isOutOfStock ? (
                                    <Badge variant="destructive" className="text-sm py-1.5 px-3">
                                        Out of Stock
                                    </Badge>
                                ) : isLowStock ? (
                                    <div className="flex flex-col gap-2">
                                        <Badge variant="default" className="bg-orange-500 text-white text-sm py-1.5 px-3 w-fit">
                                            Low Stock
                                        </Badge>
                                        <p className="text-sm text-orange-600 font-medium">
                                            Only {stock} left in stock!
                                        </p>
                                    </div>
                                ) : (
                                    <Badge variant="default" className="bg-green-500 text-white text-sm py-1.5 px-3">
                                        In Stock
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="prose prose-gray max-w-none">
                            <p className="text-gray-600 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        <div className="pt-8 border-t border-gray-200 flex gap-4">
                            <Button
                                size="lg"
                                className="flex-1 md:flex-none md:min-w-[200px]"
                                onClick={() => addToCart(product, selectedVariant)}
                                disabled={isOutOfStock || (product.attributes && product.attributes.length > 0 && !selectedVariant)}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className={`flex-1 md:flex-none ${isInWishlist(product.id) ? "text-red-500 hover:text-red-600 border-red-200 bg-red-50" : ""}`}
                                onClick={() => {
                                    if (isInWishlist(product.id)) {
                                        removeFromWishlist(product.id);
                                    } else {
                                        addToWishlist(product);
                                    }
                                }}
                            >
                                <Heart className={`mr-2 h-5 w-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                                {isInWishlist(product.id) ? "Saved to Wishlist" : "Add to Wishlist"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Reviews Section */}
            <ProductReviews productId={product.id} />

            {/* You May Also Like Section */}
            {relatedProducts.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}

            {/* Recently Viewed Section */}
            {recentlyViewedDisplay.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recentlyViewedDisplay.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
