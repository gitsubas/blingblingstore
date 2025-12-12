
import { Router } from 'express';
import * as adminController from './admin.controller';
import { authenticate } from '../../middleware/authenticate';
import { requireAdmin } from '../../middleware/requireAdmin';

const router = Router();

// All admin routes require authentication AND admin role
router.use(authenticate, requireAdmin);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Statistics
router.get('/orders/stats', adminController.getOrderStatistics);

// Product import
router.post('/products/import', adminController.bulkImportProducts);

export default router;
