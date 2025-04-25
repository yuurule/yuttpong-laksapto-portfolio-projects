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
import { WishlistController } from '../controllers/wishlist.controller';

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

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/logout', authenticate, authController.logout);

// Product Brand
router.get('/brand', brandController.getAllBrand);
router.get('/brand/:id', brandController.getOneBrandById);
router.post('/brand/create', authenticate, brandController.createNewBrand);
router.put('/brand/:id', authenticate, brandController.updateBrand);
router.delete('/brand/delete', authenticate, brandController.deleteBrands);

// Category
router.get('/category', categoryController.getAllCategory);
router.get('/category/:id', categoryController.getOneCategoryById);
router.post('/category/create', authenticate, categoryController.createNewCategory);
router.put('/category/:id', authenticate, categoryController.updateCategory);
router.delete('/category/delete', authenticate, categoryController.deleteCategories);

// Tag
router.get('/tag', tagController.getAllTag);
router.get('/tag/:id', tagController.getOneTagById);
router.post('/tag/create', authenticate, tagController.createNewTag);
router.put('/tag/:id', authenticate, tagController.updateTag);
router.delete('/tag/delete', authenticate, tagController.deleteTags);

// Product
router.get('/product', productController.getProducts);
router.get('/trash/product', productController.getProductsInTrash);
router.get('/product/:id', productController.getOneProduct);
router.post('/product', authenticate, productController.createNewProduct);
router.put('/product/:id', authenticate, productController.updateProduct);
router.delete('/product/delete', authenticate, productController.moveProductToTrash);

// Stock
router.get('/stock-action', authenticate, stockController.getAllStockAction);
router.get('/stock-action/:id', authenticate, stockController.getOneStockActionById);
router.post('/stock-action', authenticate, stockController.createNewStockAction);
router.get('/stock-sell-action', authenticate, stockController.getAllStockSellAction);

// Campaign
router.get('/campaign', campaignController.getCampaigns);
router.get('/campaign/:id', campaignController.getOneCampaignById);
router.post('/campaign', authenticate, campaignController.createCampaign);
router.put('/campaign/update/:id', authenticate, campaignController.updateCampaign);
router.put('/campaign/activate/:id', authenticate, campaignController.activateCampaign);
router.delete('/campaign', authenticate, campaignController.moveCampaignsToTrash);
router.post('/campaign/history', authenticate, campaignController.createCampaignHistory);
router.post('/campaign/:id/add-product', authenticate, campaignController.addProductsToCampaign);
router.delete('/campaign/:id/remove-product', authenticate, campaignController.removeProductsToCampaign);

// Customer
router.post('/customer/auth/register', customerController.register);
router.post('/customer/auth/login', customerController.login);
router.post('/customer/auth/refresh', customerController.refresh);
router.post('/customer/auth/logout', authenticate, customerController.logout);
router.get('/customer', authenticate, customerController.getCustomers);
router.get('/customer/:id', authenticate, customerController.getOneCustomer);

// Review
router.get('/review', reviewController.getReviews);
router.get('/review/:id', reviewController.getOneReview);
router.post('/review/create', authenticate, reviewController.createReview);
router.put('/review/update/:id', authenticate, reviewController.updateReview);
router.put('/review/approve/:id', authenticate, reviewController.approveReview);
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

// Wishlist
router.post('/wishlist/add', authenticate, wishlistController.addWishlist);
router.delete('/wishlist/:id', authenticate, wishlistController.removeWishlist);

// Data for webadmin
router.get('/statistic/products', authenticate, productController.getStatisticProducts);
router.get('/statistic/categories', authenticate, categoryController.getStatisticCategories);
router.get('/statistic/tags', authenticate, tagController.getStatisticTags);
router.get('/statistic/customers', authenticate, customerController.getStatisticCustomers);

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