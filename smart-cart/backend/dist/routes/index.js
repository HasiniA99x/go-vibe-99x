"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const database_service_1 = require("../services/database.service");
const router = (0, express_1.Router)();
const dbService = new database_service_1.DatabaseService();
// Auth routes
router.post('/auth/register', auth_controller_1.AuthController.register);
router.post('/auth/login', auth_controller_1.AuthController.login);
// Product routes
router.get('/products', product_controller_1.ProductController.getAllProducts);
router.get('/products/:id', product_controller_1.ProductController.getProductById);
// Protected routes
router.use(auth_middleware_1.authenticateToken);
// Cart routes
router.get('/cart', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbService.getCartItems(req.user.id);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching cart' });
    }
}));
router.post('/cart', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity } = req.body;
        const result = yield dbService.addToCart(req.user.id, productId, quantity);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding to cart' });
    }
}));
router.put('/cart/:productId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const result = yield dbService.updateCartItem(req.user.id, parseInt(productId), quantity);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating cart' });
    }
}));
router.delete('/cart/:productId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        yield dbService.removeFromCart(req.user.id, parseInt(productId));
        res.json({ message: 'Item removed from cart' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error removing from cart' });
    }
}));
// Order routes
router.post('/orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { totalAmount } = req.body;
        const result = yield dbService.createOrder(req.user.id, totalAmount);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating order' });
    }
}));
router.get('/orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbService.getUserOrders(req.user.id);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
}));
// Admin routes
router.use((0, auth_middleware_1.authorizeRole)(['admin', 'manager']));
router.post('/products', product_controller_1.ProductController.createProduct);
router.put('/products/:id', product_controller_1.ProductController.updateProduct);
router.delete('/products/:id', product_controller_1.ProductController.deleteProduct);
router.get('/admin/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbService.getAllUsers();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
}));
router.put('/admin/users/:id/role', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const result = yield dbService.updateUserRole(parseInt(id), role);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user role' });
    }
}));
router.get('/admin/statistics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbService.getOrderStatistics();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching statistics' });
    }
}));
exports.default = router;
