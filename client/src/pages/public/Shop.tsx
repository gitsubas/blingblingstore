import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../../components/ui/ProductCard";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useProducts } from "../../context/ProductsContext";
import { cn } from "../../lib/utils";
import { Star, X, Filter } from "lucide-react";

const defaultCategories = [
    "Decor",
    "Paintings",
    "Vases",
    "Cosmetics",
    "Apparel",
    "Jewelry",
    "Bags",
];

const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Top Rated", value: "rating" },
];

export function Shop() {
    const { products } = useProducts();
    const [searchParams, setSearchParams] = useSearchParams();

    // State for filters
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [minRating, setMinRating] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState("newest");
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Initialize from URL params
    useEffect(() => {
        const categoryParam = searchParams.get("category");
        if (categoryParam) {
            setSelectedCategories(categoryParam.split(","));
        } else {
            setSelectedCategories([]);
        }

        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        if (minPrice || maxPrice) {
            setPriceRange({ min: minPrice || "", max: maxPrice || "" });
        }

        const ratingParam = searchParams.get("rating");
        if (ratingParam) {
            setMinRating(Number(ratingParam));
        }

        const sortParam = searchParams.get("sort");
        if (sortParam) {
            setSortBy(sortParam);
        }
    }, [searchParams]);

    // Derive all unique categories from products and default list
    const allCategories = Array.from(new Set([
        ...defaultCategories,
        ...products.map(p => p.category)
    ])).sort();

    const searchQuery = searchParams.get("search") || "";

    // Update URL when filters change
    const updateFilters = (
        newCategories: string[],
        newPrice: { min: string, max: string },
        newRating: number | null,
        newSort: string
    ) => {
        const newParams = new URLSearchParams(searchParams);

        if (newCategories.length > 0) {
            newParams.set("category", newCategories.join(","));
        } else {
            newParams.delete("category");
        }

        if (newPrice.min) newParams.set("minPrice", newPrice.min);
        else newParams.delete("minPrice");

        if (newPrice.max) newParams.set("maxPrice", newPrice.max);
        else newParams.delete("maxPrice");

        if (newRating) newParams.set("rating", newRating.toString());
        else newParams.delete("rating");

        if (newSort !== "newest") newParams.set("sort", newSort);
        else newParams.delete("sort");

        setSearchParams(newParams);
    };

    // Handlers
    const toggleCategory = (category: string) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];
        setSelectedCategories(newCategories);
        updateFilters(newCategories, priceRange, minRating, sortBy);
    };

    const handlePriceChange = (type: 'min' | 'max', value: string) => {
        const newPrice = { ...priceRange, [type]: value };
        setPriceRange(newPrice);
        // Debounce URL update for price input could be added here, 
        // but for simplicity we'll update on blur or "Apply" button if we had one.
        // For now, let's update immediately but maybe user experience is better with a button.
    };

    const applyPriceFilter = () => {
        updateFilters(selectedCategories, priceRange, minRating, sortBy);
    };

    const handleRatingChange = (rating: number | null) => {
        setMinRating(rating);
        updateFilters(selectedCategories, priceRange, rating, sortBy);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value;
        setSortBy(newSort);
        updateFilters(selectedCategories, priceRange, minRating, newSort);
    };

    const handleClearAll = () => {
        setSearchParams({});
        setSelectedCategories([]);
        setPriceRange({ min: "", max: "" });
        setMinRating(null);
        setSortBy("newest");
    };

    // Filtering Logic
    let filteredProducts = products.filter(product => {
        // Category Filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return false;
        }

        // Price Filter
        const price = product.price;
        const min = priceRange.min ? Number(priceRange.min) : 0;
        const max = priceRange.max ? Number(priceRange.max) : Infinity;
        if (price < min || price > max) {
            return false;
        }

        // Rating Filter
        if (minRating && (product.rating || 0) < minRating) {
            return false;
        }

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            );
        }

        return true;
    });

    // Sorting Logic
    filteredProducts.sort((a, b) => {
        switch (sortBy) {
            case "price_asc":
                return a.price - b.price;
            case "price_desc":
                return b.price - a.price;
            case "rating":
                return (b.rating || 0) - (a.rating || 0);
            case "newest":
            default:
                // Assuming higher ID is newer for now, or we could add a date field
                return b.id.localeCompare(a.id);
        }
    });

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

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        className="lg:hidden"
                        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                    </Button>
                    <select
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                        value={sortBy}
                        onChange={handleSortChange}
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>

                    {(searchQuery || selectedCategories.length > 0 || priceRange.min || priceRange.max || minRating) && (
                        <Button variant="outline" onClick={handleClearAll} size="sm">
                            Clear Filters
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className={cn("w-full lg:w-64 flex-shrink-0 space-y-8", isMobileFiltersOpen ? "block" : "hidden lg:block")}>
                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                        <div className="space-y-2">
                            {allCategories.map((cat) => (
                                <label key={cat} className="flex items-center space-x-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat)}
                                        onChange={() => toggleCategory(cat)}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className={`text-sm ${selectedCategories.includes(cat) ? "text-primary font-medium" : "text-gray-600 group-hover:text-gray-900"}`}>
                                        {cat}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    placeholder="Min"
                                    value={priceRange.min}
                                    onChange={(e) => handlePriceChange('min', e.target.value)}
                                    className="h-9 text-sm"
                                />
                                <span className="text-gray-400">-</span>
                                <Input
                                    type="number"
                                    placeholder="Max"
                                    value={priceRange.max}
                                    onChange={(e) => handlePriceChange('max', e.target.value)}
                                    className="h-9 text-sm"
                                />
                            </div>
                            <Button variant="outline" size="sm" className="w-full" onClick={applyPriceFilter}>
                                Apply Price
                            </Button>
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Rating</h3>
                        <div className="space-y-2">
                            {[4, 3, 2, 1].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => handleRatingChange(minRating === rating ? null : rating)}
                                    className={cn(
                                        "flex items-center space-x-2 w-full text-sm hover:bg-gray-50 p-1 rounded",
                                        minRating === rating ? "bg-primary/5 font-medium" : "text-gray-600"
                                    )}
                                >
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={cn("h-4 w-4", i < rating ? "fill-current" : "text-gray-300")}
                                            />
                                        ))}
                                    </div>
                                    <span>& Up</span>
                                </button>
                            ))}
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
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
                                <X className="w-full h-full" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                            <p className="text-gray-500 mt-1">
                                Try adjusting your filters or search query.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={handleClearAll}
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
