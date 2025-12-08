
import prisma from '../../utils/prisma';
import { Product } from '@prisma/client';

export const createProduct = async (
    data: any,
    imageUrls: string[]
) => {
    const { name, description, price, categoryId, variants } = data;

    // Convert price to float
    const parsedPrice = parseFloat(price);

    return await prisma.product.create({
        data: {
            name,
            description,
            price: parsedPrice,
            categoryId,
            images: {
                create: imageUrls.map((url) => ({ url })),
            },
            variants: {
                create: variants ? JSON.parse(variants) : [],
            },
        },
        include: {
            images: true,
            variants: true,
            category: true,
        },
    });
};

export const getProducts = async (query: any) => {
    const { category, search, sort } = query;

    const where: any = {};
    if (category) where.categoryId = category;
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    const orderBy: any = {};
    if (sort === 'price_asc') orderBy.price = 'asc';
    if (sort === 'price_desc') orderBy.price = 'desc';
    if (sort === 'newest') orderBy.createdAt = 'desc';

    return await prisma.product.findMany({
        where,
        orderBy,
        include: {
            images: true,
            category: true,
            variants: true, // simplified
        },
    });
};

export const getProductById = async (id: string) => {
    return await prisma.product.findUnique({
        where: { id },
        include: {
            images: true,
            variants: true,
            category: true,
            reviews: { // Include reviews
                include: { user: { select: { name: true } } },
            },
        },
    });
};

export const updateProduct = async (id: string, data: any) => {
    // basic update
    return await prisma.product.update({
        where: { id },
        data,
    });
};

export const deleteProduct = async (id: string) => {
    return await prisma.product.delete({
        where: { id },
    });
};

export const getCategories = async () => {
    return await prisma.category.findMany();
};

export const createCategory = async (name: string) => {
    return await prisma.category.create({ data: { name } });
}
