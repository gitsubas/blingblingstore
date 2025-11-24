import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductsContext";
import { ProductReviews } from "../../components/product/ProductReviews";

export function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { products } = useProducts();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const product = products.find((p) => p.id === id);

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

    return (
        <div className="max-w-6xl mx-auto">
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
                            Rs. {product.price.toFixed(2)}
                        </p>
                    </div>

                    <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <div className="pt-8 border-t border-gray-200">
                        <Button
                            size="lg"
                            className="w-full md:w-auto min-w-[200px]"
                            onClick={() => addToCart(product)}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </div>

            {/* Customer Reviews Section */}
            <ProductReviews productId={product.id} />
        </div>
    );
}
