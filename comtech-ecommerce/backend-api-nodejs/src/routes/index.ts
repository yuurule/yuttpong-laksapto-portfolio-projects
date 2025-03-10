import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { AuthController } from '../controllers/auth.controller';
import { CustomerController } from '../controllers/customer.controller';
import { ProductController } from '../controllers/product.controller';
import { CategoryController } from '../controllers/category.controller';
import { TagController } from '../controllers/tag.controller';
import { BrandController } from '../controllers/brand.controller';
import { StockController } from '../controllers/stock.controller';
import { CampaignController } from '../controllers/campaign.controller';
import { ReviewController } from '../controllers/review.controller';
import { CartController } from '../controllers/cart.controller';
import { OrderController } from '../controllers/order.controller';

const router = express.Router();
const authController = new AuthController();
const customerController = new CustomerController();
const productController = new ProductController();
const categoryController = new CategoryController();
const tagController = new TagController();
const brandController = new BrandController();
const stockController = new StockController();
const campaignController = new CampaignController();
const reviewController = new ReviewController();
const cartController = new CartController();
const orderController = new OrderController();

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/logout', authenticate, authController.logout);

// Product Brand
router.get('/brand', authenticate, brandController.getAllBrand);
router.get('/brand/:id', authenticate, brandController.getOneBrandById);
router.post('/brand/create', authenticate, brandController.createNewBrand);
router.put('/brand/:id', authenticate, brandController.updateBrand);
router.delete('/brand/delete', authenticate, brandController.deleteBrands);

// Category
router.get('/category', authenticate, categoryController.getAllCategory);
router.get('/category/:id', authenticate, categoryController.getOneCategoryById);
router.post('/category/create', authenticate, categoryController.createNewCategory);
router.put('/category/:id', authenticate, categoryController.updateCategory);
router.delete('/category/delete', authenticate, categoryController.deleteCategories);

// Tag
router.get('/tag', authenticate, tagController.getAllTag);
router.get('/tag/:id', authenticate, tagController.getOneTagById);
router.post('/tag/create', authenticate, tagController.createNewTag);
router.put('/tag/:id', authenticate, tagController.updateTag);
router.delete('/tag/delete', authenticate, tagController.deleteTags);

// Product
router.get('/product', authenticate, productController.getProducts);
router.get('/product/:id', authenticate, productController.getOneProduct);
router.post('/product/create', authenticate, productController.createNewProduct);
router.put('/product/:id', authenticate, productController.updateProduct);
router.delete('/product/delete', authenticate, productController.moveProductToTrash);

// Stock
router.get('/stock-action', authenticate, stockController.getAllStockAction);
router.get('/stock-action/:id', authenticate, stockController.getOneStockActionById);
router.post('/stock-action/create', authenticate, stockController.createNewStockAction);

// Campaign
router.get('/campaign', authenticate, campaignController.getCampaigns);
router.get('/campaign/:id', authenticate, campaignController.getOneCampaignById);
router.post('/campaign/create', authenticate, campaignController.createCampaign);
router.put('/campaign/:id', authenticate, campaignController.updateCampaign);
router.delete('/campaign/delete', authenticate, campaignController.moveCampaignsToTrash);
router.post('/campaign/history/create', authenticate, campaignController.createCampaignHistory);

// Customer
router.post('/customer/auth/register', customerController.register);
router.post('/customer/auth/login', customerController.login);
router.post('/customer/auth/refresh', customerController.refresh);
router.post('/customer/auth/logout', authenticate, customerController.logout);

// Review
router.get('/customer/review', authenticate, reviewController.getReviews);
router.get('/customer/review/:id', authenticate, reviewController.getOneReview);
router.post('/customer/review/create', authenticate, reviewController.createReview);
router.put('/customer/review/update/:id', authenticate, reviewController.updateReview);
router.put('/customer/review/approve/:id', authenticate, reviewController.approveReview);
router.delete('/customer/review/delete/:id', authenticate, reviewController.deleteReview);

// Cart
router.get('/cart', authenticate, cartController.getCartItems);
router.get('/cart/customer/:id', authenticate, cartController.getCartByCustomer);
router.post('/cart/add', authenticate, cartController.addCartItem);
router.put('/cart/:id', authenticate, cartController.updateCartItem);
router.delete('/cart/delete', authenticate, cartController.deleteCartItems);

// Order
router.get('/order', authenticate, orderController.getOrders);
router.get('/order/:id', authenticate, orderController.getOrderById);
router.post('/order/create', authenticate, orderController.createOrder);
router.put('/order/:id/payment', authenticate, orderController.updatePayment);
router.put('/order/:id/delivery', authenticate, orderController.updateDelivery);

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