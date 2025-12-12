import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate request body against the provided Zod schema
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Format Zod validation errors
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                return res.status(400).json({
                    error: 'Validation failed',
                    details: errors
                });
            }

            // Handle other errors
            console.error('Validation error:', error);
            return res.status(400).json({ error: 'Invalid request data' });
        }
    };
};
