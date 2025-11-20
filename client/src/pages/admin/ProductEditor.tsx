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
        image: "",
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
                    image: product.image,
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
            image: formData.image,
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

                <div className="space-y-2">
                    <label className="text-sm font-medium">Image URL</label>
                    <Input
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        required
                    />
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
