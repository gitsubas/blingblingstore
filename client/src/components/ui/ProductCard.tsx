import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Product, useCart } from "../../context/CartContext";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const images = product.images && product.images.length > 0 ? product.images : [product.image];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const goToNext = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const goToPrevious = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const selectImage = (index: number, e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentImageIndex(index);
    };

    const showGalleryControls = images.length > 1;

    return (
        <Card className="overflow-hidden flex flex-col h-full group">
            <div className="relative">
                {/* Main Image Display */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                        src={images[currentImageIndex]}
                        alt={`${product.name} - Image ${currentImageIndex + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                            {product.category}
                        </Badge>
                    </div>

                    {/* Navigation Arrows - Only show if multiple images */}
                    {showGalleryControls && (
                        <>
                            <button
                                onClick={goToPrevious}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="h-4 w-4 text-gray-800" />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                                aria-label="Next image"
                            >
                                <ChevronRight className="h-4 w-4 text-gray-800" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnail Gallery - Only show if multiple images */}
                {showGalleryControls && (
                    <div className="flex gap-2 p-2 bg-white overflow-x-auto">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={(e) => selectImage(index, e)}
                                className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${currentImageIndex === index
                                        ? 'border-primary shadow-md scale-105'
                                        : 'border-gray-200 hover:border-gray-300 opacity-60 hover:opacity-100'
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

            <CardContent className="flex-1 p-4">
                <Link to={`/product/${product.id}`} className="block group-hover:text-primary transition-colors">
                    <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                </Link>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {product.description}
                </p>
                <div className="mt-2 font-bold text-lg">
                    Rs. {product.price.toFixed(2)}
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full"
                    onClick={() => addToCart(product)}
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}
