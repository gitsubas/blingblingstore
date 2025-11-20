import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Product, useCart } from "../../context/CartContext";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    return (
        <Card className="overflow-hidden flex flex-col h-full group">
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                        {product.category}
                    </Badge>
                </div>
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
