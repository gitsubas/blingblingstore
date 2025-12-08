
import { Request, Response } from 'express';
import * as productService from './product.service';
import { uploadImage } from '../../services/storage.service';

export const createProduct = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        const imageUrls = await Promise.all(
            (files || []).map((file) => uploadImage(file))
        );

        const product = await productService.createProduct(req.body, imageUrls);
        res.status(201).json(product);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await productService.getProducts(req.query);
        res.json(products);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    const categories = await productService.getCategories();
    res.json(categories);
}

export const createCategory = async (req: Request, res: Response) => {
    try {
        const category = await productService.createCategory(req.body.name);
        res.status(201).json(category);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}
