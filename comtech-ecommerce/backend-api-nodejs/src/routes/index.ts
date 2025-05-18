import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';
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
import { WishlistController } from '../controllers/wishlist.controller';
import { PaymentController } from '../controllers/payment.controller';

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
const wishlistController = new WishlistController();
const paymentController = new PaymentController();

// Auth routes
router.post('/auth/register', authController.register); // Just for portfolio, not use this in real project
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/logout', authenticate, authController.logout);

// Product Brand
router.get('/brand', brandController.getAllBrand);
router.get('/brand/:id', brandController.getOneBrandById);
router.post('/brand/create', authenticate, authorize(['ADMIN']), brandController.createNewBrand);
router.put('/brand/:id', authenticate, authorize(['ADMIN']), brandController.updateBrand);
router.delete('/brand/delete', authenticate, authorize(['ADMIN']), brandController.deleteBrands);

// Category
router.get('/category', categoryController.getAllCategory);
router.get('/category/:id', categoryController.getOneCategoryById);
router.post('/category/create', authenticate, authorize(['ADMIN']), categoryController.createNewCategory);
router.put('/category/:id', authenticate, authorize(['ADMIN']), categoryController.updateCategory);
router.delete('/category/delete', authenticate, authorize(['ADMIN']), categoryController.deleteCategories);

// Tag
router.get('/tag', tagController.getAllTag);
router.get('/tag/:id', tagController.getOneTagById);
router.post('/tag/create', authenticate, authorize(['ADMIN']), tagController.createNewTag);
router.put('/tag/:id', authenticate, authorize(['ADMIN']), tagController.updateTag);
router.delete('/tag/delete', authenticate, authorize(['ADMIN']), tagController.deleteTags);

// Product
router.get('/product', productController.getProducts);
router.get('/trash/product', productController.getProductsInTrash);
router.get('/product/:id', productController.getOneProduct);
router.post('/product', authenticate, authorize(['ADMIN']), upload.array('images', 10), productController.createNewProduct);
router.put('/product/:id', authenticate, authorize(['ADMIN']), upload.array('images', 10), productController.updateProduct);
router.delete('/product/delete', authenticate, authorize(['ADMIN']), productController.moveProductToTrash);

// Stock
router.get('/stock-action', authenticate, stockController.getAllStockAction);
router.get('/stock-action/:id', authenticate, stockController.getOneStockActionById);
router.post('/stock-action', authenticate, authorize(['ADMIN']), stockController.createNewStockAction);
router.get('/stock-sell-action', authenticate, stockController.getAllStockSellAction);

// Campaign
router.get('/campaign', campaignController.getCampaigns);
router.get('/campaign/:id', campaignController.getOneCampaignById);
router.post('/campaign', authenticate, authorize(['ADMIN']), campaignController.createCampaign);
router.put('/campaign/update/:id', authenticate, authorize(['ADMIN']), campaignController.updateCampaign);
router.put('/campaign/activate/:id', authenticate, authorize(['ADMIN']), campaignController.activateCampaign);
router.delete('/campaign', authenticate, authorize(['ADMIN']), campaignController.moveCampaignsToTrash);
router.post('/campaign/history', authenticate, authorize(['ADMIN']), campaignController.createCampaignHistory);
router.post('/campaign/:id/add-product', authenticate, authorize(['ADMIN']), campaignController.addProductsToCampaign);
router.delete('/campaign/:id/remove-product', authenticate, authorize(['ADMIN']), campaignController.removeProductsToCampaign);

// Customer
router.post('/customer/auth/register', customerController.register);
router.post('/customer/auth/login', customerController.login);
router.post('/customer/auth/refresh', customerController.refresh);
router.post('/customer/auth/logout', authenticate, customerController.logout);
router.get('/customer', authenticate, customerController.getCustomers);
router.get('/customer/:id', authenticate, customerController.getOneCustomer);
router.put('/customer/:id/update-detail', authenticate, customerController.updateOneCustomer);
router.get('/suspense/customer', authenticate, customerController.getSuspenseCustomers);
router.delete('/suspense/customer', authenticate, authorize(['ADMIN']), customerController.suspenseCustomers);

// Review
router.get('/review', reviewController.getReviews);
router.get('/review/:id', reviewController.getOneReview);
router.get('/reviewByProduct/:id', reviewController.getReviewByProduct);
router.post('/review/create', authenticate, reviewController.createReview);
router.put('/review/update/:id', authenticate, reviewController.updateReview);
router.put('/review/approve/:id', authenticate, authorize(['ADMIN']), reviewController.approveReview);
router.delete('/review/delete/:id', authenticate, reviewController.deleteReview);

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

// Payment
// สร้าง Payment Intent
router.post('/payment/create-payment-intent', authenticate, paymentController.createPaymentIntent);
// ตรวจสอบสถานะการชำระเงิน
router.get('/payment/verify-payment/:paymentId', authenticate, paymentController.verifyPayment);
// Webhook สำหรับ Stripe (ไม่มีการแปลง JSON)
router.post(
  '/payment/webhook', 
  authenticate,
  express.raw({ type: 'application/json' }), 
  paymentController.stripeWebhook
);

// Wishlist
router.get('/wishlistByCustomer/:id', authenticate, wishlistController.getWishlistsByCustomer);
router.post('/wishlist/add', authenticate, wishlistController.addWishlist);
router.delete('/wishlist/:id', authenticate, wishlistController.removeWishlist);

// Data for webadmin
router.get('/statistic/products', authenticate, authorize(['ADMIN', 'EDITOR', 'GUEST']), productController.getStatisticProducts);
router.get('/statistic/categories', authenticate, authorize(['ADMIN', 'EDITOR', 'GUEST']), categoryController.getStatisticCategories);
router.get('/statistic/tags', authenticate, authorize(['ADMIN', 'EDITOR', 'GUEST']), tagController.getStatisticTags);
router.get('/statistic/customers', authenticate, authorize(['ADMIN', 'EDITOR', 'GUEST']), customerController.getStatisticCustomers);

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