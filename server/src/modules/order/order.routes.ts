
import { Router } from 'express';
import * as orderController from './order.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Customer Routes
router.post('/', authenticate, orderController.placeOrder);
router.get('/my-orders', authenticate, orderController.getMyOrders);
router.get('/:id', authenticate, orderController.getOrderDetails);
router.post('/:id/cancel', authenticate, orderController.cancelOrder);
router.post('/:id/return', authenticate, orderController.requestReturn);

// Admin Routes (Ideally should have admin middleware)
router.get('/admin/all', authenticate, orderController.getAllOrders);
router.patch('/admin/:id/status', authenticate, orderController.updateStatus);
router.post('/admin/returns/:returnId/process', authenticate, orderController.processReturn);

export default router;
