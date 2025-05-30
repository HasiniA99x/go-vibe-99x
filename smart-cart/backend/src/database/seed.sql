-- Insert sample users
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@example.com', '$2b$10$your_hashed_password', 'admin'),
('user1', 'user1@example.com', '$2b$10$your_hashed_password', 'user'),
('user2', 'user2@example.com', '$2b$10$your_hashed_password', 'user');

-- Insert sample products
INSERT INTO products (name, description, price, stock, image_url) VALUES
('Smartphone X', 'Latest smartphone with advanced features', 999.99, 50, 'https://example.com/smartphone.jpg'),
('Laptop Pro', 'High-performance laptop for professionals', 1499.99, 30, 'https://example.com/laptop.jpg'),
('Wireless Earbuds', 'Premium wireless earbuds with noise cancellation', 199.99, 100, 'https://example.com/earbuds.jpg'),
('Smart Watch', 'Fitness tracker and smartwatch combo', 299.99, 75, 'https://example.com/watch.jpg'),
('Bluetooth Speaker', 'Portable speaker with amazing sound quality', 149.99, 60, 'https://example.com/speaker.jpg');

-- Insert sample cart items
INSERT INTO cart_items (user_id, product_id, quantity) VALUES
(2, 1, 1),
(2, 3, 2),
(3, 2, 1);

-- Insert sample orders
INSERT INTO orders (user_id, total_amount, status) VALUES
(2, 1199.98, 'completed'),
(3, 1499.99, 'pending');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 999.99),
(1, 3, 1, 199.99),
(2, 2, 1, 1499.99); 