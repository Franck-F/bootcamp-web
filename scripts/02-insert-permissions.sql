-- Insert basic permissions
INSERT INTO permissions (name, description) VALUES
('manage_users', 'Create, read, update, delete users'),
('manage_products', 'Create, read, update, delete products'),
('manage_orders', 'View and manage all orders'),
('view_analytics', 'Access to analytics and reports'),
('manage_inventory', 'Update product inventory'),
('process_payments', 'Handle payment processing'),
('customer_support', 'Access customer support tools')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to roles
INSERT INTO role_permissions (role, permission_id) VALUES
-- Admin permissions (all)
('admin', (SELECT id FROM permissions WHERE name = 'manage_users')),
('admin', (SELECT id FROM permissions WHERE name = 'manage_products')),
('admin', (SELECT id FROM permissions WHERE name = 'manage_orders')),
('admin', (SELECT id FROM permissions WHERE name = 'view_analytics')),
('admin', (SELECT id FROM permissions WHERE name = 'manage_inventory')),
('admin', (SELECT id FROM permissions WHERE name = 'process_payments')),
('admin', (SELECT id FROM permissions WHERE name = 'customer_support')),

-- Seller permissions (limited)
('seller', (SELECT id FROM permissions WHERE name = 'manage_products')),
('seller', (SELECT id FROM permissions WHERE name = 'manage_inventory')),
('seller', (SELECT id FROM permissions WHERE name = 'view_analytics')),
('seller', (SELECT id FROM permissions WHERE name = 'customer_support'))

ON CONFLICT (role, permission_id) DO NOTHING;
