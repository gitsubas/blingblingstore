import prisma from '../../utils/prisma';

// Get all products with optional filtering
export const getAllProducts = async (params?: {
    category?: string;
    search?: string;
    sort?: string;
}) => {
    const { category, search, sort } = params || {};

    // Build where clause
    const where: any = {};

    if (category) {
        where.category = {
            name: {
                equals: category,
                mode: 'insensitive'
            }
        };
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
        ];
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }; // Default sort

    if (sort === 'price_asc') {
        orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
        orderBy = { price: 'desc' };
    } else if (sort === 'name_asc') {
        orderBy = { name: 'asc' };
    } else if (sort === 'name_desc') {
        orderBy = { name: 'desc' };
    }

    const products = await prisma.product.findMany({
        where,
        include: {
            category: true,
            variants: true,
            images: true
        },
        orderBy
    });

    return products;
};

// Get product by ID
export const getProductById = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            variants: true,
            images: true,
            reviews: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }
        }
    });

    if (!product) {
        throw new Error('Product not found');
    }

    return product;
};

// Get featured products
export const getFeaturedProducts = async () => {
    const products = await prisma.product.findMany({
        where: { featured: true },
        include: {
            category: true,
            variants: true,
            images: true
        },
        orderBy: { createdAt: 'desc' },
        take: 8
    });

    return products;
};

// Create product (Admin only)
export const createProduct = async (data: {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    stock: number;
    featured?: boolean;
    lowStockThreshold?: number;
    variants?: any[];
    images?: string[];
}) => {
    const { variants, images, ...productData } = data;

    const product = await prisma.product.create({
        data: {
            ...productData,
            reviewCount: 0,
            rating: null,
            variants: variants ? {
                create: variants.map(v => ({
                    attributes: v.attributes,
                    price: v.price,
                    stock: v.stock
                }))
            } : undefined,
            images: images ? {
                create: images.map((url, index) => ({
                    url,
                    isPrimary: index === 0
                }))
            } : undefined
        },
        include: {
            category: true,
            variants: true,
            images: true
        }
    });

    return product;
};

// Update product (Admin only)
export const updateProduct = async (id: string, data: Partial<{
    name: string;
    description: string;
    price: number;
    categoryId: string;
    stock: number;
    featured: boolean;
    lowStockThreshold: number;
}>) => {
    const product = await prisma.product.update({
        where: { id },
        data,
        include: {
            category: true,
            variants: true,
            images: true
        }
    });

    return product;
};

// Delete product (Admin only)
export const deleteProduct = async (id: string) => {
    await prisma.product.delete({
        where: { id }
    });

    return { message: 'Product deleted successfully' };
};

// Get all categories
export const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    return categories;
};

// Create category (Admin only)
export const createCategory = async (name: string) => {
    const category = await prisma.category.create({
        data: { name }
    });

    return category;
};
