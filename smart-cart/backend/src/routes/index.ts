import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { ProductController } from '../controllers/product.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { DatabaseService } from '../services/database.service';

const router = Router();
const dbService = new DatabaseService();

// Auth routes
router.post('/auth/register', AuthController.register as RequestHandler);
router.post('/auth/login', AuthController.login as RequestHandler);

// Product routes
router.get('/products', ProductController.getAllProducts as RequestHandler);
router.get('/products/:id', ProductController.getProductById as RequestHandler);

// Protected routes
router.use(authenticateToken as RequestHandler);

// Cart routes
router.get('/cart', async (req, res) => {
    try {
        const result = await dbService.getCartItems(req.user!.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart' });
    }
});

router.post('/cart', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const result = await dbService.addToCart(req.user!.id, productId, quantity);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart' });
    }
});

router.put('/cart/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const result = await dbService.updateCartItem(req.user!.id, parseInt(productId), quantity);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart' });
    }
});

router.delete('/cart/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        await dbService.removeFromCart(req.user!.id, parseInt(productId));
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from cart' });
    }
});

// Order routes
router.post('/orders', async (req, res) => {
    try {
        const { totalAmount } = req.body;
        const result = await dbService.createOrder(req.user!.id, totalAmount);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order' });
    }
});

router.get('/orders', async (req, res) => {
    try {
        const result = await dbService.getUserOrders(req.user!.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Admin routes
router.use(authorizeRole(['admin', 'manager']) as RequestHandler);

router.post('/products', ProductController.createProduct as RequestHandler);
router.put('/products/:id', ProductController.updateProduct as RequestHandler);
router.delete('/products/:id', ProductController.deleteProduct as RequestHandler);

router.get('/admin/users', async (req, res) => {
    try {
        const result = await dbService.getAllUsers();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

router.put('/admin/users/:id/role', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const result = await dbService.updateUserRole(parseInt(id), role);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role' });
    }
});

router.get('/admin/statistics', async (req, res) => {
    try {
        const result = await dbService.getOrderStatistics();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics' });
    }
});

export default router; 