import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useProducts } from "../../context/ProductsContext";
import { ProductAttribute, ProductVariant } from "../../context/CartContext";
import { Plus, Trash2, RefreshCw } from "lucide-react";

// Local interface for form handling
interface FormAttribute {
    name: string;
    values: string; // Keep as string for editing
}

export function ProductEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addProduct, updateProduct } = useProducts();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        images: [] as string[],
        description: "",
        stock: "",
        lowStockThreshold: "5",
        attributes: [] as FormAttribute[],
        variants: [] as ProductVariant[],
    });

    // Derive categories for suggestions
    const defaultCategories = ["Decor", "Paintings", "Vases", "Cosmetics", "Apparel", "Jewelry", "Bags"];
    const allCategories = Array.from(new Set([
        ...defaultCategories,
        ...products.map(p => p.category)
    ])).sort();

    useEffect(() => {
        if (isEditMode) {
            const product = products.find((p) => p.id === id);
            if (product) {
                setFormData({
                    name: product.name,
                    price: product.price.toString(),
                    category: product.category,
                    images: product.images || [product.image],
                    description: product.description,
                    stock: product.stock?.toString() || "",
                    lowStockThreshold: product.lowStockThreshold?.toString() || "5",
                    attributes: product.attributes?.map(a => ({
                        name: a.name,
                        values: a.values.join(", ")
                    })) || [],
                    variants: product.variants || [],
                });
            }
        }
    }, [id, isEditMode, products]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const attributes: ProductAttribute[] = formData.attributes.map(a => ({
            name: a.name,
            values: a.values.split(",").map(v => v.trim()).filter(Boolean)
        })).filter(a => a.name && a.values.length > 0);

        const productData = {
            name: formData.name,
            price: parseFloat(formData.price),
            category: formData.category,
            image: formData.images[0] || "",
            images: formData.images,
            description: formData.description,
            stock: formData.stock ? parseInt(formData.stock) : undefined,
            lowStockThreshold: formData.lowStockThreshold ? parseInt(formData.lowStockThreshold) : 5,
            attributes: attributes,
            variants: formData.variants,
        };

        if (isEditMode && id) {
            updateProduct(id, productData);
        } else {
            addProduct(productData);
        }

        navigate("/admin/products");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? "Edit Product" : "Add New Product"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Product Name</label>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Price</label>
                        <Input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Input
                            list="categories"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                            placeholder="Select or type new category"
                        />
                        <datalist id="categories">
                            {allCategories.map(cat => (
                                <option key={cat} value={cat} />
                            ))}
                        </datalist>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium">Product Images</label>

                    {/* Image Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {formData.images.map((img, index) => (
                            <div key={index} className="relative group aspect-square border rounded-lg overflow-hidden bg-gray-50">
                                <img
                                    src={img}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newImages = formData.images.filter((_, i) => i !== index);
                                        setFormData({ ...formData, images: newImages });
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                                {index === 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1">
                                        Main Image
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Upload Button */}
                        <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors aspect-square">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            <span className="text-xs text-gray-500">Upload Images</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    files.forEach(file => {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            if (reader.result) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    images: [...prev.images, reader.result as string]
                                                }));
                                            }
                                        };
                                        reader.readAsDataURL(file);
                                    });
                                }}
                            />
                        </label>
                    </div>

                    {/* URL Input */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add Image URL"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const input = e.currentTarget;
                                    if (input.value) {
                                        setFormData(prev => ({
                                            ...prev,
                                            images: [...prev.images, input.value]
                                        }));
                                        input.value = '';
                                    }
                                }
                            }}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                if (input.value) {
                                    setFormData(prev => ({
                                        ...prev,
                                        images: [...prev.images, input.value]
                                    }));
                                    input.value = '';
                                }
                            }}
                        >
                            Add URL
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Stock Quantity</label>
                        <Input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="Available stock"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        />
                        <p className="text-xs text-gray-500">Leave empty for unlimited stock</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Low Stock Threshold</label>
                        <Input
                            type="number"
                            min="1"
                            step="1"
                            value={formData.lowStockThreshold}
                            onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                        />
                        <p className="text-xs text-gray-500">Show warning when stock is below this</p>
                    </div>
                </div>

                {/* Stock Status Indicator */}
                {formData.stock && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium mb-2">Current Stock Status:</p>
                        {parseInt(formData.stock) === 0 ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                Out of Stock
                            </span>
                        ) : parseInt(formData.stock) <= parseInt(formData.lowStockThreshold || "5") ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                Low Stock ({formData.stock} units)
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                In Stock ({formData.stock} units)
                            </span>
                        )}
                    </div>
                )}

                {/* Attributes Section */}
                <div className="space-y-4 border-t pt-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Product Attributes</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setFormData(prev => ({
                                ...prev,
                                attributes: [...prev.attributes, { name: "", values: "" }]
                            }))}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Attribute
                        </Button>
                    </div>

                    {formData.attributes.map((attr, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                            <div className="flex gap-3">
                                <Input
                                    placeholder="Attribute Name (e.g. Size)"
                                    value={attr.name}
                                    onChange={(e) => {
                                        const newAttrs = [...formData.attributes];
                                        newAttrs[index].name = e.target.value;
                                        setFormData({ ...formData, attributes: newAttrs });
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-red-500"
                                    onClick={() => {
                                        const newAttrs = formData.attributes.filter((_, i) => i !== index);
                                        setFormData({ ...formData, attributes: newAttrs });
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div>
                                <Input
                                    placeholder="Values (comma separated, e.g. S, M, L)"
                                    value={attr.values}
                                    onChange={(e) => {
                                        const newAttrs = [...formData.attributes];
                                        newAttrs[index].values = e.target.value;
                                        setFormData({ ...formData, attributes: newAttrs });
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Variants Section */}
                {formData.attributes.length > 0 && (
                    <div className="space-y-4 border-t pt-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Variants</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    // Generate variants logic
                                    if (formData.attributes.length === 0) return;

                                    // Parse attributes from string to array for generation
                                    const parsedAttributes: ProductAttribute[] = formData.attributes.map(a => ({
                                        name: a.name,
                                        values: a.values.split(",").map(v => v.trim()).filter(Boolean)
                                    })).filter(a => a.name && a.values.length > 0);

                                    if (parsedAttributes.length === 0) return;

                                    const generateCombinations = (attributes: ProductAttribute[], current: { [key: string]: string } = {}): { [key: string]: string }[] => {
                                        if (attributes.length === 0) return [current];
                                        const [first, ...rest] = attributes;
                                        const combinations: { [key: string]: string }[] = [];

                                        for (const value of first.values) {
                                            combinations.push(...generateCombinations(rest, { ...current, [first.name]: value }));
                                        }
                                        return combinations;
                                    };

                                    const combinations = generateCombinations(parsedAttributes);
                                    const newVariants: ProductVariant[] = combinations.map(combo => {
                                        // Check if variant already exists to preserve price/stock
                                        const existing = formData.variants.find(v =>
                                            JSON.stringify(v.attributes) === JSON.stringify(combo)
                                        );

                                        return existing || {
                                            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                                            attributes: combo,
                                            price: parseFloat(formData.price) || 0,
                                            stock: 0
                                        };
                                    });

                                    setFormData({ ...formData, variants: newVariants });
                                }}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Generate Variants
                            </Button>
                        </div>

                        {formData.variants.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3">Variant</th>
                                            <th className="px-4 py-3">Price</th>
                                            <th className="px-4 py-3">Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.variants.map((variant, index) => (
                                            <tr key={variant.id} className="border-b">
                                                <td className="px-4 py-3 font-medium">
                                                    {Object.entries(variant.attributes).map(([key, val]) => `${key}: ${val}`).join(", ")}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Input
                                                        type="number"
                                                        className="w-24"
                                                        value={variant.price}
                                                        onChange={(e) => {
                                                            const newVariants = [...formData.variants];
                                                            newVariants[index].price = parseFloat(e.target.value);
                                                            setFormData({ ...formData, variants: newVariants });
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Input
                                                        type="number"
                                                        className="w-24"
                                                        value={variant.stock}
                                                        onChange={(e) => {
                                                            const newVariants = [...formData.variants];
                                                            newVariants[index].stock = parseInt(e.target.value);
                                                            setFormData({ ...formData, variants: newVariants });
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/admin")}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">
                        {isEditMode ? "Update Product" : "Create Product"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
