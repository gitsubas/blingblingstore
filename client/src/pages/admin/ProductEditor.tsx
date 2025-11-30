import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useProducts } from "../../context/ProductsContext";

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
    });

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
                });
            }
        }
    }, [id, isEditMode, products]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const productData = {
            name: formData.name,
            price: parseFloat(formData.price),
            category: formData.category,
            image: formData.images[0] || "",
            images: formData.images,
            description: formData.description,
        };

        if (isEditMode && id) {
            updateProduct(id, productData);
        } else {
            addProduct(productData);
        }

        navigate("/admin");
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
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        />
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
