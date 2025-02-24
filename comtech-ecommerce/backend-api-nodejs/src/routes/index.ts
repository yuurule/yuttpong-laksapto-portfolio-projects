import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();
const authController = new AuthController();

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refreshToken', authController.refresh);
router.post('/auth/logout',authenticate, authController.logout);

// Products


// Protected route example
// router.get(
//   '/admin',
//   authenticate,
//   authorize(['ADMIN']),
//   (req, res) => {
//     res.json({ message: 'Admin access granted' });
//   }
// );

export default router;