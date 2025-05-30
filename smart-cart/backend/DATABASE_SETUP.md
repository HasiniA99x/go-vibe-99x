# Database Setup Guide for SmartCart

## Prerequisites
- Node.js and npm installed
- Basic knowledge of SQL and database management

## 1. SQLite Installation

SQLite comes pre-installed with Node.js, but you'll need the `sqlite3` package:

```bash
npm install sqlite3
```

## 2. Database Configuration

1. Create a `.env` file in the backend directory:
```env
DB_PATH=./data/smartcart.db
```

2. The database file will be automatically created in the specified path.

## 3. Database Schema

The database consists of the following tables:

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_amount REAL NOT NULL,
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Cart Items Table
```sql
CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## 4. Database Initialization

1. Navigate to the backend directory:
```bash
cd smart-cart/backend
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the database:
```bash
npm run db:init
```

This will:
- Create the database file
- Create all tables
- Set up indexes
- Insert sample data

## 5. Database Indexes

The following indexes are created for better performance:

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
```

## 6. Sample Data

The initialization script includes sample data for:
- Admin user
- Regular customers
- Products
- Sample orders
- Sample cart items

## 7. Database Maintenance

### Backup
```bash
# Simply copy the database file
cp ./data/smartcart.db ./backups/smartcart_$(date +%Y%m%d).db
```

### Restore
```bash
# Replace the current database with backup
cp ./backups/smartcart_backup.db ./data/smartcart.db
```

## 8. Troubleshooting

### Common Issues

1. **File Permissions**
   - Ensure the application has write permissions to the database directory
   - Check if the database file is not locked by another process

2. **Database Locked**
   - SQLite uses file-level locking
   - Ensure only one process writes to the database at a time
   - Use proper connection pooling

3. **Database Already Exists**
   - Delete the existing database file
   - Run initialization script again

## 9. Security Considerations

1. **Password Storage**
   - Passwords are hashed using bcrypt
   - Never store plain text passwords

2. **Database Access**
   - Use environment variables for database path
   - Restrict file system access to database file
   - Regular security updates

3. **Backup Strategy**
   - Regular automated backups
   - Secure backup storage
   - Test restore procedures

## 10. Performance Optimization

1. **Indexes**
   - All foreign keys are indexed
   - Frequently queried columns are indexed

2. **Connection Pooling**
   - SQLite is file-based, so connection pooling is handled differently
   - Use a single connection for the application
   - Implement proper connection management

3. **Query Optimization**
   - Use prepared statements for all queries
   - Implement proper indexing strategy
   - Monitor query performance 