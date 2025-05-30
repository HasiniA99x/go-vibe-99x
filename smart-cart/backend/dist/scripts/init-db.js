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
const database_1 = __importDefault(require("../config/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create tables
            yield database_1.default.serialize(() => {
                // Users table
                database_1.default.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    role TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
                // Products table
                database_1.default.run(`
                CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    price REAL NOT NULL,
                    stock INTEGER NOT NULL,
                    image_url TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
                // Orders table
                database_1.default.run(`
                CREATE TABLE IF NOT EXISTS orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    total_amount REAL NOT NULL,
                    status TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            `);
                // Order items table
                database_1.default.run(`
                CREATE TABLE IF NOT EXISTS order_items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_id INTEGER,
                    product_id INTEGER,
                    quantity INTEGER NOT NULL,
                    price REAL NOT NULL,
                    FOREIGN KEY (order_id) REFERENCES orders(id),
                    FOREIGN KEY (product_id) REFERENCES products(id)
                )
            `);
                // Cart items table
                database_1.default.run(`
                CREATE TABLE IF NOT EXISTS cart_items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    product_id INTEGER,
                    quantity INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id),
                    FOREIGN KEY (product_id) REFERENCES products(id)
                )
            `);
                // Create indexes
                database_1.default.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
                database_1.default.run('CREATE INDEX IF NOT EXISTS idx_products_name ON products(name)');
                database_1.default.run('CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)');
                database_1.default.run('CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)');
                database_1.default.run('CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id)');
            });
            // Insert sample data
            const hashedPassword = yield bcrypt_1.default.hash('admin123', 10);
            // Insert admin user
            database_1.default.run('INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)', ['admin@smartcart.com', hashedPassword, 'admin']);
            // Insert sample products
            const products = [
                {
                    name: 'Smartphone X',
                    description: 'Latest smartphone with advanced features',
                    price: 999.99,
                    stock: 50,
                    image_url: 'https://example.com/smartphone-x.jpg'
                },
                {
                    name: 'Laptop Pro',
                    description: 'High-performance laptop for professionals',
                    price: 1499.99,
                    stock: 30,
                    image_url: 'https://example.com/laptop-pro.jpg'
                },
                {
                    name: 'Wireless Earbuds',
                    description: 'Premium wireless earbuds with noise cancellation',
                    price: 199.99,
                    stock: 100,
                    image_url: 'https://example.com/earbuds.jpg'
                }
            ];
            products.forEach(product => {
                database_1.default.run('INSERT OR IGNORE INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)', [product.name, product.description, product.price, product.stock, product.image_url]);
            });
            console.log('Database initialized successfully');
        }
        catch (error) {
            console.error('Error initializing database:', error);
            process.exit(1);
        }
    });
}
initializeDatabase();
