import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { AuthController } from '../controllers/auth.controller';
import { ProductController } from '../controllers/product.controller';

const router = express.Router();
const authController = new AuthController();
const productController = new ProductController();

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refreshToken', authController.refresh);
router.post('/auth/logout', authenticate, authController.logout);

// Customer


// Product
router.get('/product', authenticate, productController.getProducts);
router.get('/product/:id', authenticate, productController.getOneProduct);
router.post('/product/create', authenticate, productController.createNewProduct);
router.put('/product/:id', authenticate, productController.updateProduct);
router.put('/product/move-to-trash', authenticate, productController.moveProductToTrash);

// Stock


// Category


// Tag


// Review


// Cart


// Order


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