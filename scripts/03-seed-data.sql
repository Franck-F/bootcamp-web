-- Insert sample users with hashed passwords
-- Password for all users: "password123"
-- Hash generated with bcrypt rounds=12
INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified) VALUES
('admin@sneakerstore.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5W', 'Admin', 'User', 'admin', true),
('seller@sneakerstore.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5W', 'Seller', 'User', 'seller', true),
('customer@sneakerstore.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5W', 'John', 'Doe', 'customer', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, brand, category, base_price, is_active, created_by) VALUES
('Air Max 90', 'Iconic running shoe with visible Air cushioning', 'Nike', 'Running', 120.00, true, 1),
('Stan Smith', 'Classic white leather tennis shoe', 'Adidas', 'Lifestyle', 80.00, true, 1),
('Chuck Taylor All Star', 'Timeless canvas high-top sneaker', 'Converse', 'Lifestyle', 60.00, true, 1),
('Air Jordan 1 Retro High', 'Basketball legend in premium leather', 'Jordan', 'Basketball', 170.00, true, 1),
('Ultraboost 22', 'Energy-returning running shoe', 'Adidas', 'Running', 180.00, true, 1),
('Air Force 1', 'Basketball classic with premium leather', 'Nike', 'Basketball', 90.00, true, 1),
('Old Skool', 'Skateboarding shoe with signature side stripe', 'Vans', 'Skateboarding', 65.00, true, 1),
('990v5', 'Premium running shoe made in USA', 'New Balance', 'Running', 185.00, true, 1)
ON CONFLICT DO NOTHING;

-- Insert product variants (sizes and colors)
INSERT INTO product_variants (product_id, size, color, price, stock_quantity, sku) VALUES
-- Air Max 90 variants
(1, '8', 'White/Black', 120.00, 15, 'AM90-WB-8'),
(1, '9', 'White/Black', 120.00, 20, 'AM90-WB-9'),
(1, '10', 'White/Black', 120.00, 18, 'AM90-WB-10'),
(1, '8', 'Red/White', 125.00, 12, 'AM90-RW-8'),
(1, '9', 'Red/White', 125.00, 15, 'AM90-RW-9'),

-- Stan Smith variants
(2, '8', 'White/Green', 80.00, 25, 'SS-WG-8'),
(2, '9', 'White/Green', 80.00, 30, 'SS-WG-9'),
(2, '10', 'White/Green', 80.00, 22, 'SS-WG-10'),
(2, '8', 'White/Navy', 85.00, 18, 'SS-WN-8'),

-- Chuck Taylor variants
(3, '8', 'Black', 60.00, 20, 'CT-B-8'),
(3, '9', 'Black', 60.00, 25, 'CT-B-9'),
(3, '10', 'Black', 60.00, 23, 'CT-B-10'),
(3, '8', 'White', 60.00, 22, 'CT-W-8'),
(3, '9', 'Red', 65.00, 15, 'CT-R-9'),

-- Air Jordan 1 variants
(4, '8', 'Bred', 170.00, 8, 'AJ1-BRED-8'),
(4, '9', 'Bred', 170.00, 10, 'AJ1-BRED-9'),
(4, '10', 'Bred', 170.00, 6, 'AJ1-BRED-10'),
(4, '9', 'Royal', 175.00, 5, 'AJ1-ROYAL-9'),

-- Ultraboost variants
(5, '8', 'Core Black', 180.00, 12, 'UB22-CB-8'),
(5, '9', 'Core Black', 180.00, 15, 'UB22-CB-9'),
(5, '10', 'Core Black', 180.00, 10, 'UB22-CB-10'),
(5, '9', 'White', 180.00, 8, 'UB22-W-9'),

-- Air Force 1 variants
(6, '8', 'White', 90.00, 30, 'AF1-W-8'),
(6, '9', 'White', 90.00, 35, 'AF1-W-9'),
(6, '10', 'White', 90.00, 28, 'AF1-W-10'),
(6, '9', 'Black', 95.00, 20, 'AF1-B-9'),

-- Old Skool variants
(7, '8', 'Black/White', 65.00, 18, 'OS-BW-8'),
(7, '9', 'Black/White', 65.00, 22, 'OS-BW-9'),
(7, '10', 'Black/White', 65.00, 20, 'OS-BW-10'),

-- New Balance 990v5 variants
(8, '8', 'Grey', 185.00, 10, 'NB990-G-8'),
(8, '9', 'Grey', 185.00, 12, 'NB990-G-9'),
(8, '10', 'Grey', 185.00, 8, 'NB990-G-10')

ON CONFLICT (sku) DO NOTHING;

-- Insert sample orders
INSERT INTO orders (user_id, order_number, status, total_amount, shipping_address, billing_address, payment_method, payment_status) VALUES
(3, 'ORD-2024-001', 'delivered', 240.00, 
 '{"street": "123 Main St", "city": "Paris", "postal_code": "75001", "country": "France"}',
 '{"street": "123 Main St", "city": "Paris", "postal_code": "75001", "country": "France"}',
 'credit_card', 'paid'),
(3, 'ORD-2024-002', 'shipped', 170.00,
 '{"street": "123 Main St", "city": "Paris", "postal_code": "75001", "country": "France"}',
 '{"street": "123 Main St", "city": "Paris", "postal_code": "75001", "country": "France"}',
 'credit_card', 'paid')
ON CONFLICT (order_number) DO NOTHING;

-- Insert order items
INSERT INTO order_items (order_id, product_variant_id, quantity, unit_price, total_price) VALUES
(1, 1, 2, 120.00, 240.00),
(2, 4, 1, 170.00, 170.00)
ON CONFLICT DO NOTHING;

-- Insert sample cart items
INSERT INTO shopping_carts (user_id, product_variant_id, quantity) VALUES
(3, 6, 1),
(3, 10, 2)
ON CONFLICT (user_id, product_variant_id) DO NOTHING;

-- Insert sample wishlist items
INSERT INTO wishlists (user_id, product_id) VALUES
(3, 5),
(3, 8)
ON CONFLICT (user_id, product_id) DO NOTHING;
