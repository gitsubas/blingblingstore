
import { Request, Response } from 'express';
import * as authService from './auth.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;
        const result = await authService.register(email, password, name);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    res.json(req.user);
};
