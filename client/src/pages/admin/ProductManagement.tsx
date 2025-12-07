import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Package, Upload } from "lucide-react";
import { useProducts } from "../../context/ProductsContext";
import Papa from "papaparse";
import { useRef, useState } from "react";

interface CSVProduct {
    name: string;
    price: string;
    category: string;
    description: string;
    stock: string;
    image: string;
    // Optional variant fields matching CSV headers
    variant_type?: string;// e.g., "Size" or "Color"
    variant_value?: string;// e.g., "M" or "Red"
    variant_price?: string;// price for this variant (optional, defaults to product price)
    variant_stock?: string;// stock for this variant (optional, defaults to product stock)
}

export function ProductManagement() {
    const { products, deleteProduct, addProduct } = useProducts();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFiles, setImageFiles] = useState<FileList | null>(null);
    const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteProduct(id);
        }
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setImageFiles(event.target.files);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImportStatus(null);

        Papa.parse<CSVProduct>(file, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.toLowerCase().trim(), // Normalize headers
            transform: (value, field) => { // Trim all values
                if (typeof value === 'string') {
                    return value.trim();
                }
                return value;
            },
            complete: async (results) => {
                if (results.errors.length > 0) {
                    setImportStatus({ type: 'error', message: `Error parsing CSV: ${results.errors[0].message}` });
                    return;
                }

                const productsMap = new Map<string, any>();

                results.data.forEach((row) => {
                    // Basic validation
                    if (!row.name || !row.price || !row.category) {
                        return;
                    }

                    if (!productsMap.has(row.name)) {
                        productsMap.set(row.name, {
                            name: row.name,
                            price: parseFloat(row.price),
                            category: row.category,
                            description: row.description || "",
                            stock: row.stock ? parseInt(row.stock) : 0,

                            image: row.image || "https://via.placeholder.com/150",
                            attributes: [],
                            variants: [],
                            _rawImages: new Set<string>()
                        });
                    }

                    // Accumulate images
                    const productEntry = productsMap.get(row.name);
                    if (row.image) {
                        row.image.split(',').forEach((img: string) => {
                            const trimmed = img.trim();
                            if (trimmed) productEntry._rawImages.add(trimmed);
                        });
                    }

                    // Add variant if present
                    if (row.variant_type && row.variant_value) {
                        const product = productsMap.get(row.name);
                        product.variants.push({
                            id: `${row.name}-${row.variant_value}`,
                            attributes: { [row.variant_type]: row.variant_value },
                            price: row.variant_price ? parseFloat(row.variant_price) : parseFloat(row.price),
                            stock: row.variant_stock ? parseInt(row.variant_stock) : (row.stock ? parseInt(row.stock) : 0) // Fallback to row stock if variant stock not set
                        });
                    }
                });

                let successCount = 0;
                let errorCount = 0; // Reset error count to track actual add failures

                // Process images and add products
                const productsToProcess = Array.from(productsMap.values());

                for (const product of productsToProcess) {
                    try {
                        // Calculate attributes from variants
                        if (product.variants.length > 0) {
                            const attributeMap = new Map<string, Set<string>>();

                            product.variants.forEach((variant: any) => {
                                Object.entries(variant.attributes).forEach(([key, value]) => {
                                    if (!attributeMap.has(key)) {
                                        attributeMap.set(key, new Set());
                                    }
                                    attributeMap.get(key)?.add(String(value));
                                });
                            });

                            product.attributes = Array.from(attributeMap.entries()).map(([name, values]) => ({
                                name,
                                values: Array.from(values)
                            }));
                        }

                        // Handle Image Upload logic
                        // Handle Image Upload logic
                        product.images = [];
                        if (product._rawImages.size > 0) {
                            for (const imgName of Array.from(product._rawImages) as string[]) {
                                let finalImage = imgName;

                                // Try to match with uploaded file
                                if (imageFiles && !imgName.startsWith('http')) {
                                    const matchedFile = Array.from(imageFiles).find(f => f.name.toLowerCase() === imgName.toLowerCase());
                                    if (matchedFile) {
                                        try {
                                            const base64 = await new Promise<string>((resolve, reject) => {
                                                const reader = new FileReader();
                                                reader.onload = () => resolve(reader.result as string);
                                                reader.onerror = reject;
                                                reader.readAsDataURL(matchedFile);
                                            });
                                            finalImage = base64;
                                        } catch (err) {
                                            console.error("Error reading image file for product:", product.name, err);
                                        }
                                    }
                                }
                                product.images.push(finalImage);
                            }
                        }

                        // Set main image to first image or placeholder
                        if (product.images.length > 0) {
                            product.image = product.images[0];
                        } else {
                            product.image = "https://via.placeholder.com/150";
                            product.images = ["https://via.placeholder.com/150"];
                        }

                        // Clean up internal property
                        delete product._rawImages;

                        addProduct(product);
                        successCount++;
                    } catch (e) {
                        errorCount++;
                    }
                }

                // Calculate skipped rows (invalid data)
                const invalidRows = results.data.filter(row => !row.name || !row.price || !row.category).length;
                const totalErrors = errorCount + invalidRows;

                setImportStatus({
                    type: successCount > 0 ? 'success' : 'error',
                    message: `Imported ${successCount} products. ${totalErrors > 0 ? `Failed to import ${totalErrors} rows.` : ''}`
                });

                // Reset input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            error: (error) => {
                setImportStatus({ type: 'error', message: `File read error: ${error.message}` });
            }
        });
    };

    const getStockStatus = (stock?: number, lowStockThreshold?: number) => {
        if (stock === undefined) {
            return { label: "Unlimited", color: "bg-blue-100 text-blue-800" };
        }
        if (stock === 0) {
            return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
        }
        const threshold = lowStockThreshold ?? 5;
        if (stock <= threshold) {
            return { label: `Low Stock (${stock})`, color: "bg-orange-100 text-orange-800" };
        }
        return { label: `In Stock (${stock})`, color: "bg-green-100 text-green-800" };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Product Inventory</h2>
                    <p className="text-gray-600 mt-1">Manage your product stock and inventory</p>
                </div>
                <div className="flex space-x-3">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-input"
                    />
                    <label
                        htmlFor="image-input"
                        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <Upload className="h-5 w-5" />
                        <span>{imageFiles && imageFiles.length > 0 ? `${imageFiles.length} Images Selected` : 'Select Images'}</span>
                    </label>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".csv"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Upload className="h-5 w-5" />
                        <span>Import CSV</span>
                    </button>
                    <Link
                        to="/admin/products/new"
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add New Product</span>
                    </Link>
                </div>
            </div>

            {/* Import Status Message */}
            {importStatus && (
                <div className={`p-4 rounded-lg ${importStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {importStatus.message}
                </div>
            )}

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                        </div>
                        <Package className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">In Stock</p>
                            <p className="text-2xl font-bold text-green-600">
                                {products.filter(p => (p.stock ?? Infinity) > (p.lowStockThreshold ?? 5)).length}
                            </p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <div className="h-4 w-4 rounded-full bg-green-500"></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Low Stock</p>
                            <p className="text-2xl font-bold text-orange-600">
                                {products.filter(p => {
                                    const stock = p.stock ?? Infinity;
                                    const threshold = p.lowStockThreshold ?? 5;
                                    return stock > 0 && stock <= threshold;
                                }).length}
                            </p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <div className="h-4 w-4 rounded-full bg-orange-500"></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Out of Stock</p>
                            <p className="text-2xl font-bold text-red-600">
                                {products.filter(p => p.stock === 0).length}
                            </p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                            <div className="h-4 w-4 rounded-full bg-red-500"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-lg font-medium">No products yet</p>
                                        <p className="text-sm mt-1">Get started by adding your first product</p>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => {
                                    const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);
                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                    />
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {product.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                Rs. {product.price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                                                    {stockStatus.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        to={`/admin/products/${product.id}`}
                                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
