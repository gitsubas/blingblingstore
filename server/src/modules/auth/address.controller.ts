
import { Request, Response } from 'express';
import * as addressService from './address.service';

export const getAddresses = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const addresses = await addressService.getAddresses(req.user.id);
        res.status(200).json({ addresses });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const createAddress = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const address = await addressService.createAddress(req.user.id, req.body);
        res.status(201).json({ address });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateAddress = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { id } = req.params;
        const address = await addressService.updateAddress(id, req.user.id, req.body);
        res.status(200).json({ address });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { id } = req.params;
        await addressService.deleteAddress(id, req.user.id);
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const setDefaultAddress = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { id } = req.params;
        const address = await addressService.setDefaultAddress(id, req.user.id);
        res.status(200).json({ address });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
