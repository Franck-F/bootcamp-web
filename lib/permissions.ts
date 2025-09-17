export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
}

export interface Role {
  id: string
  name: string
  permissions: string[]
}

// Granular permissions following principle of least privilege
export const PERMISSIONS: Record<string, Permission> = {
  // User management
  "users:read": {
    id: "users:read",
    name: "View Users",
    description: "View user profiles",
    resource: "users",
    action: "read",
  },
  "users:create": {
    id: "users:create",
    name: "Create Users",
    description: "Create new users",
    resource: "users",
    action: "create",
  },
  "users:update": {
    id: "users:update",
    name: "Update Users",
    description: "Update user profiles",
    resource: "users",
    action: "update",
  },
  "users:delete": {
    id: "users:delete",
    name: "Delete Users",
    description: "Delete user accounts",
    resource: "users",
    action: "delete",
  },

  // Product management
  "products:read": {
    id: "products:read",
    name: "View Products",
    description: "View product catalog",
    resource: "products",
    action: "read",
  },
  "products:create": {
    id: "products:create",
    name: "Create Products",
    description: "Add new products",
    resource: "products",
    action: "create",
  },
  "products:update": {
    id: "products:update",
    name: "Update Products",
    description: "Modify existing products",
    resource: "products",
    action: "update",
  },
  "products:delete": {
    id: "products:delete",
    name: "Delete Products",
    description: "Remove products",
    resource: "products",
    action: "delete",
  },

  // Order management
  "orders:read": {
    id: "orders:read",
    name: "View Orders",
    description: "View order details",
    resource: "orders",
    action: "read",
  },
  "orders:read_own": {
    id: "orders:read_own",
    name: "View Own Orders",
    description: "View own orders only",
    resource: "orders",
    action: "read_own",
  },
  "orders:update": {
    id: "orders:update",
    name: "Update Orders",
    description: "Modify order status",
    resource: "orders",
    action: "update",
  },
  "orders:cancel": {
    id: "orders:cancel",
    name: "Cancel Orders",
    description: "Cancel orders",
    resource: "orders",
    action: "cancel",
  },

  // Cart management
  "cart:read_own": {
    id: "cart:read_own",
    name: "View Own Cart",
    description: "View own shopping cart",
    resource: "cart",
    action: "read_own",
  },
  "cart:update_own": {
    id: "cart:update_own",
    name: "Update Own Cart",
    description: "Modify own cart",
    resource: "cart",
    action: "update_own",
  },

  // Wishlist management
  "wishlist:read_own": {
    id: "wishlist:read_own",
    name: "View Own Wishlist",
    description: "View own wishlist",
    resource: "wishlist",
    action: "read_own",
  },
  "wishlist:update_own": {
    id: "wishlist:update_own",
    name: "Update Own Wishlist",
    description: "Modify own wishlist",
    resource: "wishlist",
    action: "update_own",
  },

  // Analytics and reporting
  "analytics:read": {
    id: "analytics:read",
    name: "View Analytics",
    description: "Access analytics dashboard",
    resource: "analytics",
    action: "read",
  },

  // System administration
  "system:admin": {
    id: "system:admin",
    name: "System Administration",
    description: "Full system access",
    resource: "system",
    action: "admin",
  },
}

// Role definitions with minimal necessary permissions
export const ROLES: Record<string, Role> = {
  customer: {
    id: "customer",
    name: "Customer",
    permissions: [
      "products:read",
      "orders:read_own",
      "cart:read_own",
      "cart:update_own",
      "wishlist:read_own",
      "wishlist:update_own",
    ],
  },
  seller: {
    id: "seller",
    name: "Seller",
    permissions: [
      "products:read",
      "products:create",
      "products:update",
      "orders:read",
      "orders:update",
      "analytics:read",
    ],
  },
  admin: {
    id: "admin",
    name: "Administrator",
    permissions: Object.keys(PERMISSIONS), // All permissions
  },
}

export function hasPermission(userRole: string, requiredPermission: string): boolean {
  const role = ROLES[userRole]
  if (!role) return false

  return role.permissions.includes(requiredPermission)
}

export function hasAnyPermission(userRole: string, requiredPermissions: string[]): boolean {
  return requiredPermissions.some((permission) => hasPermission(userRole, permission))
}

export function hasAllPermissions(userRole: string, requiredPermissions: string[]): boolean {
  return requiredPermissions.every((permission) => hasPermission(userRole, permission))
}
