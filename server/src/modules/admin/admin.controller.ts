
import { Request, Response } from 'express';
import * as adminService from './admin.service';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { page, limit, search } = req.query;
        const result = await adminService.getAllUsers(
            page ? parseInt(page as string) : 1,
            limit ? parseInt(limit as string) : 10,
            search as string
        );
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['CUSTOMER', 'ADMIN'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be CUSTOMER or ADMIN' });
        }

        const user = await adminService.updateUserRole(id, role);
        res.status(200).json({ user });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await adminService.deleteUser(id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getOrderStatistics = async (req: Request, res: Response) => {
    try {
        const stats = await adminService.getOrderStatistics();
        res.status(200).json({ stats });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const bulkImportProducts = async (req: Request, res: Response) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Products array is required and must not be empty' });
        }

        const result = await adminService.bulkImportProducts(products);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
