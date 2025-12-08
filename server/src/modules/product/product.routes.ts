
import { Router } from 'express';
import * as productController from './product.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload.middleware';

const router = Router();

// Public
router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProductById);

// Admin (protected) - ideally add admin check middleware
router.post('/', authenticate, upload.array('images', 5), productController.createProduct);
router.delete('/:id', authenticate, productController.deleteProduct);
router.post('/categories', authenticate, productController.createCategory);

export default router;
