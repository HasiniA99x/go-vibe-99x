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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const database_1 = __importDefault(require("../config/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class DatabaseService {
    // User operations
    createUser(email, password, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            return new Promise((resolve, reject) => {
                database_1.default.run('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role], function (err) {
                    if (err)
                        reject(err);
                    resolve({ id: this.lastID, email, role });
                });
            });
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                    if (err)
                        reject(err);
                    resolve(row || null);
                });
            });
        });
    }
    // Product operations
    getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.all('SELECT * FROM products ORDER BY created_at DESC', (err, rows) => {
                    if (err)
                        reject(err);
                    resolve(rows);
                });
            });
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
                    if (err)
                        reject(err);
                    resolve(row || null);
                });
            });
        });
    }
    createProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.run('INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)', [product.name, product.description, product.price, product.stock, product.image_url], function (err) {
                    if (err)
                        reject(err);
                    resolve(Object.assign(Object.assign({ id: this.lastID }, product), { created_at: new Date() }));
                });
            });
        });
    }
    updateProduct(id, product) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentProduct = yield this.getProductById(id);
            if (!currentProduct)
                return null;
            const updatedProduct = Object.assign(Object.assign({}, currentProduct), product);
            return new Promise((resolve, reject) => {
                database_1.default.run('UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image_url = ? WHERE id = ?', [
                    updatedProduct.name,
                    updatedProduct.description,
                    updatedProduct.price,
                    updatedProduct.stock,
                    updatedProduct.image_url,
                    id
                ], (err) => {
                    if (err)
                        reject(err);
                    resolve(updatedProduct);
                });
            });
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.run('DELETE FROM products WHERE id = ?', [id], function (err) {
                    if (err)
                        reject(err);
                    resolve(this.changes > 0);
                });
            });
        });
    }
    // Cart operations
    getCartItems(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.all(`SELECT ci.*, p.name, p.price, p.image_url 
                FROM cart_items ci 
                JOIN products p ON ci.product_id = p.id 
                WHERE ci.user_id = ?`, [userId], (err, rows) => {
                    if (err)
                        reject(err);
                    resolve(rows);
                });
            });
        });
    }
    addToCart(userId, productId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.run('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, quantity], function (err) {
                    if (err)
                        reject(err);
                    resolve({ id: this.lastID, user_id: userId, product_id: productId, quantity });
                });
            });
        });
    }
    updateCartItem(userId, productId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.run('UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?', [quantity, userId, productId], function (err) {
                    if (err)
                        reject(err);
                    resolve(this.changes > 0);
                });
            });
        });
    }
    removeFromCart(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.run('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId], function (err) {
                    if (err)
                        reject(err);
                    resolve(this.changes > 0);
                });
            });
        });
    }
    clearCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.run('DELETE FROM cart_items WHERE user_id = ?', [userId], (err) => {
                    if (err)
                        reject(err);
                    resolve();
                });
            });
        });
    }
    // Order operations
    createOrder(userId, items) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.serialize(() => {
                    database_1.default.run('BEGIN TRANSACTION');
                    // Create order
                    database_1.default.run('INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)', [userId, 0, 'pending'], function (err) {
                        if (err) {
                            database_1.default.run('ROLLBACK');
                            reject(err);
                            return;
                        }
                        const orderId = this.lastID;
                        let totalAmount = 0;
                        // Add order items
                        const addItems = items.map(item => {
                            return new Promise((resolveItem, rejectItem) => {
                                database_1.default.get('SELECT price FROM products WHERE id = ?', [item.productId], (err, product) => {
                                    if (err) {
                                        rejectItem(err);
                                        return;
                                    }
                                    const itemTotal = product.price * item.quantity;
                                    totalAmount += itemTotal;
                                    database_1.default.run('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [orderId, item.productId, item.quantity, product.price], (err) => {
                                        if (err)
                                            rejectItem(err);
                                        else
                                            resolveItem();
                                    });
                                });
                            });
                        });
                        Promise.all(addItems)
                            .then(() => {
                            // Update order total
                            database_1.default.run('UPDATE orders SET total_amount = ? WHERE id = ?', [totalAmount, orderId], (err) => {
                                if (err) {
                                    database_1.default.run('ROLLBACK');
                                    reject(err);
                                    return;
                                }
                                database_1.default.run('COMMIT');
                                resolve({ id: orderId, user_id: userId, total_amount: totalAmount, status: 'pending' });
                            });
                        })
                            .catch(err => {
                            database_1.default.run('ROLLBACK');
                            reject(err);
                        });
                    });
                });
            });
        });
    }
    getOrderById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, order) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!order) {
                        resolve(null);
                        return;
                    }
                    database_1.default.all(`SELECT oi.*, p.name, p.image_url 
                    FROM order_items oi 
                    JOIN products p ON oi.product_id = p.id 
                    WHERE oi.order_id = ?`, [orderId], (err, items) => {
                        if (err)
                            reject(err);
                        resolve(Object.assign(Object.assign({}, order), { items }));
                    });
                });
            });
        });
    }
    getUserOrders(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, orders) => {
                    if (err)
                        reject(err);
                    resolve(orders);
                });
            });
        });
    }
    updateOrderStatus(orderId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.run('UPDATE orders SET status = ? WHERE id = ?', [status, orderId], function (err) {
                    if (err)
                        reject(err);
                    resolve(this.changes > 0);
                });
            });
        });
    }
    // Admin operations
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.all('SELECT id, email, role, created_at FROM users', (err, rows) => {
                    if (err)
                        reject(err);
                    resolve(rows);
                });
            });
        });
    }
    updateUserRole(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.run('UPDATE users SET role = ? WHERE id = ?', [role, userId], function (err) {
                    if (err)
                        reject(err);
                    resolve(this.changes > 0);
                });
            });
        });
    }
    getOrderStatistics() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.get(`SELECT 
                    COUNT(*) as totalOrders,
                    SUM(total_amount) as totalRevenue,
                    AVG(total_amount) as averageOrderValue
                FROM orders 
                WHERE status = 'completed'`, (err, stats) => {
                    if (err)
                        reject(err);
                    resolve({
                        totalOrders: stats.totalOrders || 0,
                        totalRevenue: stats.totalRevenue || 0,
                        averageOrderValue: stats.averageOrderValue || 0
                    });
                });
            });
        });
    }
}
exports.DatabaseService = DatabaseService;
