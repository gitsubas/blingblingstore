import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../../components/ui/ProductCard";
import { Button } from "../../components/ui/Button";
import { useProducts } from "../../context/ProductsContext";
import { cn } from "../../lib/utils";

const categories = [
    "All",
    "Decor",
    "Paintings",
    "Vases",
    "Cosmetics",
    "Apparel",
    "Jewelry",
    "Bags",
];

export function Shop() {
    const { products } = useProducts();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentCategory = searchParams.get("category") || "All";
    const searchQuery = searchParams.get("search") || "";

    // Filter products by category
    let filteredProducts =
        currentCategory === "All"
            ? products
            : products.filter((p) => p.category === currentCategory);

    // Further filter by search query if present
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(
            (p) =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
        );
    }

    const handleClearSearch = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("search");
        setSearchParams(newParams);
    };

    const handleClearAll = () => {
        setSearchParams({});
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
                    {searchQuery && (
                        <p className="text-gray-600 mt-1">
                            Search results for: <span className="font-semibold text-primary">"{searchQuery}"</span>
                        </p>
                    )}
                    <p className="text-gray-500 mt-1">
                        {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
                    </p>
                </div>
                {(searchQuery || currentCategory !== "All") && (
                    <Button variant="outline" onClick={handleClearAll}>
                        Clear All Filters
                    </Button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <div className="sticky top-24 space-y-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                            <div className="space-y-2">
                                {categories.map((cat) => (
                                    <Button
                                        key={cat}
                                        variant={currentCategory === cat ? "primary" : "ghost"}
                                        className={cn(
                                            "w-full justify-start",
                                            currentCategory === cat ? "bg-primary/10 text-primary" : ""
                                        )}
                                        onClick={() => {
                                            const newParams = new URLSearchParams(searchParams);
                                            if (cat === "All") {
                                                newParams.delete("category");
                                            } else {
                                                newParams.set("category", cat);
                                            }
                                            setSearchParams(newParams);
                                        }}
                                    >
                                        {cat}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {searchQuery
                                    ? `No products found matching "${searchQuery}"`
                                    : "No products found in this category."
                                }
                            </p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={searchQuery ? handleClearSearch : handleClearAll}
                            >
                                {searchQuery ? "Clear Search" : "View All Products"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
