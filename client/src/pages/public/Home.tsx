import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { ProductCard } from "../../components/ui/ProductCard";
import { useProducts } from "../../context/ProductsContext";

import sculptureImg from "../../assets/products/sculpture.jpg";
import scarfImg from "../../assets/products/scarf.jpg";
import banglesImg from "../../assets/products/bangles.jpg";
import lipstickImg from "../../assets/products/lipstick.jpg";
import heroImg from "../../assets/hero.jpg";

const categories = [
    { name: "Decor", image: sculptureImg },
    { name: "Apparel", image: scarfImg },
    { name: "Jewelry", image: banglesImg },
    { name: "Cosmetics", image: lipstickImg },
];

export function Home() {
    const { products } = useProducts();
    const featuredProducts = products.slice(0, 4);

    return (
        <div className="space-y-20">
            {/* Hero Section */}
            <section className="relative rounded-2xl overflow-hidden text-white">
                <div className="absolute inset-0">
                    <img
                        src={heroImg}
                        alt="Hero Background"
                        className="h-full w-full object-cover "
                    />
                </div>
                <div className="relative z-10 px-6 py-24 sm:px-12 sm:py-32 lg:px-16">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
                        Elegant Home & Style
                    </h1>
                    <p className="mt-4 max-w-xl text-xl text-white mb-8">
                        Discover our curated collection of home decor, fashion, and accessories.
                        Elevate your lifestyle with our premium selection.
                    </p>
                    <Link to="/shop">
                        <Button size="lg" className="text-lg px-8">
                            Shop Now
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Featured Categories */}
            <section>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
                    Shop by Category
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            to={`/shop?category=${cat.name}`}
                            className="group relative rounded-lg overflow-hidden aspect-[21/9]"
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 bg-gray-900 opacity-50"
                            />
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors" />
                            <div className="absolute inset-0 flex items-center justify-center hover:scale-75 transition-transform duration-300">
                                <span className="text-white text-3xl font-bold">{cat.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Featured Products
                    </h2>
                    <Link to="/shop" className="text-primary hover:text-primary-hover font-medium">
                        View All
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </div>
    );
}
