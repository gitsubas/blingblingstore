

import { Router } from 'express';
import * as orderController from './order.controller';
import { authenticate } from '../../middleware/authenticate';
import { requireAdmin } from '../../middleware/requireAdmin';

const router = Router();

// Customer Routes
router.post('/', authenticate, orderController.placeOrder);
router.get('/my-orders', authenticate, orderController.getMyOrders);
router.get('/:id', authenticate, orderController.getOrderDetails);
router.post('/:id/cancel', authenticate, orderController.cancelOrder);
router.post('/:id/return', authenticate, orderController.requestReturn);

// Admin Routes
router.get('/admin/all', authenticate, requireAdmin, orderController.getAllOrders);
router.patch('/admin/:id/status', authenticate, requireAdmin, orderController.updateStatus);
router.post('/admin/returns/:returnId/process', authenticate, requireAdmin, orderController.processReturn);

export default router;
