import { Router } from 'express';
import * as authController from './auth.controller';
import * as addressController from './address.controller';
import { authenticate } from '../../middleware/authenticate';
import { validateRequest } from '../../middleware/validateRequest';
import {
    registerSchema,
    loginSchema,
    updateProfileSchema,
    changePasswordSchema,
    createAddressSchema,
    updateAddressSchema
} from '../../schemas/auth.schemas';

const router = Router();

// Public routes
router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);

// Protected routes - User profile
router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, validateRequest(updateProfileSchema), authController.updateProfile);
router.put('/password', authenticate, validateRequest(changePasswordSchema), authController.changePassword);

// Protected routes - Address management
router.get('/addresses', authenticate, addressController.getAddresses);
router.post('/addresses', authenticate, validateRequest(createAddressSchema), addressController.createAddress);
router.put('/addresses/:id', authenticate, validateRequest(updateAddressSchema), addressController.updateAddress);
router.delete('/addresses/:id', authenticate, addressController.deleteAddress);
router.patch('/addresses/:id/default', authenticate, addressController.setDefaultAddress);

export default router;
