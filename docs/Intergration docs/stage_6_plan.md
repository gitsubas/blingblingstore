# Stage 6: Context Refactoring - Implementation Plan

**Estimated Time:** 8-10 hours  
**Risk Level:** HIGH - Breaking changes to core functionality  
**Approach:** Incremental refactoring with testing after each context

---

## Overview

Stage 6 is the most critical phase where we replace all localStorage-based mock implementations with real API calls. This involves:

1. **AuthContext** - Complete rewrite to use authService
2. **ProductsContext** - Rewrite to use productService  
3. **OrdersContext** - Rewrite to use orderService
4. **JWT Token Management** - Implement secure token storage and refresh
5. **Security Fixes** - Remove all localStorage credential storage

---

## Phase 6.1: AuthContext Refactoring

### Current State (Mock Implementation)
- Users stored in `localStorage.getItem("users")`
- Passwords stored in `localStorage.getItem("userCredentials")`
- No JWT tokens
- Mock admin login (hardcoded "admin"/"admin")

### Target State (API Implementation)
- All auth via `authService` API calls
- JWT tokens stored in `localStorage.getItem("token")`
- User object stored in `localStorage.getItem("user")`
- No passwords in localStorage
- Real admin authentication from backend

### Changes Required

#### 1. Remove Mock Storage Functions
**Delete:**
- All `localStorage.getItem("users")` logic
- All `localStorage.getItem("userCredentials")` logic
- Hardcoded admin login

#### 2. Implement API-Based Authentication

**signup(name, email, password)**
```typescript
const signup = async (name: string, email: string, password: string): Promise<boolean> => {
  try {
    const { user, token } = await authService.register({ name, email, password });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return true;
  } catch (error) {
    console.error('Signup failed:', error);
    return false;
  }
};
```

**login(email, password, redirectTo)**
```typescript
const login = async (email: string, password: string, redirectTo?: string | null): Promise<boolean> => {
  try {
    const { user, token } = await authService.login(email, password);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    
    if (!redirectTo) {
      setTimeout(() => navigate(user.role === 'admin' ? '/admin' : '/'), 0);
    }
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};
```

**logout()**
```typescript
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setUser(null);
  navigate('/');
};
```

**getMe()** - New function to refresh user data
```typescript
const refreshUser = async () => {
  try {
    const { user } = await authService.getMe();
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  } catch (error) {
    // Token invalid, logout
    logout();
  }
};
```

#### 3. Update Profile Management

**changePassword(oldPassword, newPassword)**
```typescript
const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
  try {
    await authService.changePassword(oldPassword, newPassword);
    return true;
  } catch (error) {
    console.error('Password change failed:', error);
    return false;
  }
};
```

**updateProfile(data)**
```typescript
const updateProfile = async (data: { name?: string; email?: string }): Promise<boolean> => {
  try {
    const { user } = await authService.updateProfile(data);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return true;
  } catch (error) {
    console.error('Profile update failed:', error);
    return false;
  }
};
```

#### 4. Remove Admin-Only Mock Methods

**Delete these functions (will use adminService directly in components):**
- `getAllUsers()` → Use `adminService.getUsers()` directly
- `updateUser()` → Use `adminService.updateUserRole()` directly
- `deleteUser()` → Use `adminService.deleteUser()` directly  
- `updateUserRole()` → Use `adminService.updateUserRole()` directly
- `createUser()` → Use `authService.register()` with admin token

**Rationale:** Admin operations should be in admin components, not in AuthContext

---

## Phase 6.2: ProductsContext Refactoring

### Current State
- Products stored in `localStorage.getItem("products")`
- Uses `initialProducts` from mock data file
- Client-side CRUD operations

### Target State
- All products from `productService.getProducts()`
- Real-time data from backend
- Admin operations via `productService`

### Changes Required

#### 1. Replace State Management

**Before:**
```typescript
const [products, setProducts] = useState<Product[]>(() => {
  const saved = localStorage.getItem("products");
  return saved ? JSON.parse(saved) : initialProducts;
});
```

**After:**
```typescript
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

#### 2. Add Fetch Function

```typescript
const fetchProducts = async () => {
  setLoading(true);
  try {
    const { products } = await productService.getProducts();
    setProducts(products);
    setError(null);
  } catch (err) {
    setError('Failed to load products');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchProducts();
}, []);
```

#### 3. Update CRUD Operations

**addProduct (Admin)**
```typescript
const addProduct = async (productData: FormData): Promise<string | null> => {
  try {
    const { product } = await productService.createProduct(productData);
    setProducts(prev => [...prev, product]);
    return product.id;
  } catch (error) {
    console.error('Failed to add product:', error);
    return null;
  }
};
```

**updateProduct (Admin)**
```typescript
const updateProduct = async (id: string, data: Partial<Product>): Promise<boolean> => {
  try {
    const { product } = await productService.updateProduct(id, data);
    setProducts(prev => prev.map(p => p.id === id ? product : p));
    return true;
  } catch (error) {
    console.error('Failed to update product:', error);
    return false;
  }
};
```

**deleteProduct (Admin)**
```typescript
const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    await productService.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    return true;
  } catch (error) {
    console.error('Failed to delete product:', error);
    return false;
  }
};
```

#### 4. Remove localStorage Sync

Delete all `useEffect` hooks that sync to localStorage.

---

## Phase 6.3: OrdersContext Refactoring

### Current State
- Orders stored in `localStorage.getItem("orders")`
- Mock order creation
- Client-side order management

### Target State
- Orders from `orderService.getUserOrders()`
- Real order creation via API
- Admin operations via `adminService`

### Changes Required

#### 1. Replace State Management

```typescript
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(false);

const fetchOrders = async () => {
  setLoading(true);
  try {
    const { orders } = await orderService.getUserOrders();
    setOrders(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  } finally {
    setLoading(false);
  }
};
```

#### 2. Update Order Creation

**createOrder**
```typescript
const createOrder = async (orderData: CreateOrderData): Promise<string | null> => {
  try {
    const { order } = await orderService.createOrder(orderData);
    setOrders(prev => [order, ...prev]);
    return order.id;
  } catch (error) {
    console.error('Failed to create order:', error);
    return null;
  }
};
```

#### 3. Update Order Actions

**cancelOrder**
```typescript
const cancelOrder = async (orderId: string): Promise<boolean> => {
  try {
    await orderService.cancelOrder(orderId);
    await fetchOrders(); // Refresh
    return true;
  } catch (error) {
    console.error('Failed to cancel order:', error);
    return false;
  }
};
```

**requestReturn**
```typescript
const requestReturn = async (orderId: string, reason: string): Promise<boolean> => {
  try {
    await orderService.requestReturn(orderId, reason);
    await fetchOrders(); // Refresh
    return true;
  } catch (error) {
    console.error('Failed to request return:', error);
    return false;
  }
};
```

---

## JWT Token Management

### Token Storage Strategy

**On Login/Register:**
```typescript
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
```

**On Logout:**
```typescript
localStorage.removeItem('token');
localStorage.removeItem('user');
```

**Token Verification:**
The `apiClient` request interceptor automatically adds the token to all requests:
```typescript
// Already implemented in apiClient.ts
config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
```

**Auto-Logout on 401:**
The `apiClient` response interceptor automatically clears token on 401:
```typescript
// Already implemented in apiClient.ts
if (error.response.status === 401) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
```

---

## Security Improvements

### Before (INSECURE)
```typescript
// ❌ Passwords in localStorage
localStorage.setItem("userCredentials", JSON.stringify([
  { email: "user@example.com", password: "plain text!", userId: "123" }
]));
```

### After (SECURE)
```typescript
// ✅ Only JWT token in localStorage
localStorage.setItem("token", "eyJhbGc..."); // JWT token
localStorage.setItem("user", JSON.stringify({ id, name, email, role })); // No password
```

**Security Benefits:**
- No passwords stored client-side
- JWT tokens expire (7 days)
- Tokens invalidated on logout
- Backend validates all requests

---

## Testing Checklist

After completing Stage 6:

### AuthContext
- [ ] User can register successfully
- [ ] User can login successfully
- [ ] JWT token stored in localStorage
- [ ] User data stored without password
- [ ] Logout clears token and user
- [ ] Profile update works
- [ ] Password change works
- [ ] Invalid credentials rejected
- [ ] Expired token triggers logout

### ProductsContext
- [ ] Products load from API
- [ ] Products display correctly
- [ ] Admin can create product
- [ ] Admin can update product
- [ ] Admin can delete product
- [ ] Non-admin cannot modify products

### OrdersContext
- [ ] Orders load for logged-in user
- [ ] Order creation works
- [ ] Order displays with items
- [ ] Order cancellation works
- [ ] Return request works
- [ ] Guest cannot create orders

---

## Rollback Plan

If issues arise:
1. Keep old context files as `.tsx.backup`
2. Test each context independently
3. Can revert individual contexts if needed

---

## Implementation Order

1. ✅ **AuthContext** (most important) - Start here
2. **ProductsContext** (moderate complexity)
3. **OrdersContext** (most complex)

**Recommendation:** Complete and test AuthContext first before moving forward.
