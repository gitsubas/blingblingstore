import { Request, Response } from 'express';
import * as productService from './product.service';

// Get all products
export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, search, sort } = req.query;

        const products = await productService.getAllProducts({
            category: category as string,
            search: search as string,
            sort: sort as string
        });

        res.json({ products });
    } catch (error: any) {
        console.error('Get products error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch products' });
    }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);
        res.json({ product });
    } catch (error: any) {
        console.error('Get product error:', error);
        res.status(404).json({ error: error.message || 'Product not found' });
    }
};

// Get featured products
export const getFeaturedProducts = async (req: Request, res: Response) => {
    try {
        const products = await productService.getFeaturedProducts();
        res.json({ products });
    } catch (error: any) {
        console.error('Get featured products error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch featured products' });
    }
};

// Create product (Admin only)
export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json({ product });
    } catch (error: any) {
        console.error('Create product error:', error);
        res.status(400).json({ error: error.message || 'Failed to create product' });
    }
};

// Update product (Admin only)
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await productService.updateProduct(id, req.body);
        res.json({ product });
    } catch (error: any) {
        console.error('Update product error:', error);
        res.status(400).json({ error: error.message || 'Failed to update product' });
    }
};

// Delete product (Admin only)
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await productService.deleteProduct(id);
        res.json(result);
    } catch (error: any) {
        console.error('Delete product error:', error);
        res.status(400).json({ error: error.message || 'Failed to delete product' });
    }
};

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await productService.getAllCategories();
        res.json({ categories });
    } catch (error: any) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch categories' });
    }
};

// Create category (Admin only)
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const category = await productService.createCategory(name);
        res.status(201).json({ category });
    } catch (error: any) {
        console.error('Create category error:', error);
        res.status(400).json({ error: error.message || 'Failed to create category' });
    }
};
