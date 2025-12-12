import { Router } from 'express';
import * as productController from './product.controller';
import { authenticate } from '../../middleware/authenticate';
import { requireAdmin } from '../../middleware/requireAdmin';
import { validateRequest } from '../../middleware/validateRequest';
import { createProductSchema, updateProductSchema, createCategorySchema } from '../../schemas/product.schemas';

const router = Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProductById);

// Admin routes
router.post(
    '/',
    authenticate,
    requireAdmin,
    validateRequest(createProductSchema),
    productController.createProduct
);

router.put(
    '/:id',
    authenticate,
    requireAdmin,
    validateRequest(updateProductSchema),
    productController.updateProduct
);

router.delete(
    '/:id',
    authenticate,
    requireAdmin,
    productController.deleteProduct
);

router.post(
    '/categories',
    authenticate,
    requireAdmin,
    validateRequest(createCategorySchema),
    productController.createCategory
);

export default router;
