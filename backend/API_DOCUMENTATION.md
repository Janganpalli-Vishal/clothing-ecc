# E-Commerce Clothing Backend API Documentation

## Base URL
```
https://clothing-ecc-application.vercel.app/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication APIs

### 1. Register User
**Endpoint:** `POST /auth/register`

**Description:** Register a new user account

**Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "user"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6789abc0def",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "phone": "+1234567890",
      "avatar": ""
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

**Error Response (400 - Validation):**
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "msg": "Please provide a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

### 2. Login User
**Endpoint:** `POST /auth/login`

**Description:** Login with email and password

**Payload:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6789abc0def",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "phone": "+1234567890",
      "avatar": ""
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. Get Current User
**Endpoint:** `GET /auth/me`

**Description:** Get currently logged-in user details

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6789abc0def",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "phone": "+1234567890",
      "avatar": "",
      "addresses": [],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

---

### 4. Update Profile
**Endpoint:** `PUT /auth/updateprofile`

**Description:** Update user profile information

**Headers:**
```
Authorization: Bearer <token>
```

**Payload:**
```json
{
  "name": "John Updated",
  "phone": "+9876543210",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6789abc0def",
      "name": "John Updated",
      "email": "john@example.com",
      "role": "user",
      "phone": "+9876543210",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
```

---

### 5. Change Password
**Endpoint:** `PUT /auth/changepassword`

**Description:** Change user password

**Headers:**
```
Authorization: Bearer <token>
```

**Payload:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

## Product APIs

### 6. Create Product (Admin Only)
**Endpoint:** `POST /products`

**Description:** Create a new product (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Payload:**
```json
{
  "name": "Men's Cotton T-Shirt",
  "description": "Comfortable 100% cotton t-shirt perfect for casual wear",
  "price": 299,
  "discountPrice": 199,
  "category": "Men",
  "subCategory": "T-Shirts",
  "brand": "Nike",
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Black", "White", "Blue"],
  "material": "Cotton",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
  ],
  "stock": 100,
  "featured": true,
  "newArrival": true,
  "bestSeller": false,
  "tags": ["casual", "summer", "cotton"],
  "weight": "200g",
  "dimensions": {
    "length": 70,
    "width": 50,
    "height": 5
  },
  "careInstructions": "Machine wash cold, tumble dry low",
  "season": "Summer",
  "style": "Casual",
  "pattern": "Solid",
  "sleeveLength": "Short",
  "neckline": "Round Neck",
  "fit": "Regular"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "_id": "65a1b2c3d4e5f6789abc0df0",
      "name": "Men's Cotton T-Shirt",
      "description": "Comfortable 100% cotton t-shirt perfect for casual wear",
      "price": 299,
      "discountPrice": 199,
      "category": "Men",
      "subCategory": "T-Shirts",
      "brand": "Nike",
      "sizes": ["S", "M", "L", "XL"],
      "colors": ["Black", "White", "Blue"],
      "material": "Cotton",
      "images": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
        "https://example.com/image3.jpg"
      ],
      "stock": 100,
      "featured": true,
      "newArrival": true,
      "bestSeller": false,
      "rating": 0,
      "numReviews": 0,
      "tags": ["casual", "summer", "cotton"],
      "weight": "200g",
      "dimensions": {
        "length": 70,
        "width": 50,
        "height": 5
      },
      "careInstructions": "Machine wash cold, tumble dry low",
      "season": "Summer",
      "style": "Casual",
      "pattern": "Solid",
      "sleeveLength": "Short",
      "neckline": "Round Neck",
      "fit": "Regular",
      "createdBy": "65a1b2c3d4e5f6789abc0def",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "User role user is not authorized to access this route"
}
```

---

### 7. Get All Products with Filtration
**Endpoint:** `GET /products`

**Description:** Get all products with optional filtering

**Query Parameters:**
- `category` - Filter by category (Men, Women, Kids, Accessories, Footwear, Sports)
- `subCategory` - Filter by sub-category
- `brand` - Filter by brand
- `size` - Filter by size (comma-separated: S,M,L)
- `color` - Filter by color (comma-separated: Black,White)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `featured` - true/false
- `newArrival` - true/false
- `bestSeller` - true/false
- `season` - Filter by season
- `material` - Filter by material
- `search` - Search by text (name, description, tags)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `sortBy` - Sort field (price, createdAt, rating)
- `sortOrder` - asc/desc (default: desc)

**Example Request:**
```
GET /products?category=Men&minPrice=100&maxPrice=500&sortBy=price&sortOrder=asc&page=1&limit=10
```

**Response (Success - 200):**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": {
    "products": [
      {
        "_id": "65a1b2c3d4e5f6789abc0df0",
        "name": "Men's Cotton T-Shirt",
        "description": "Comfortable 100% cotton t-shirt",
        "price": 299,
        "discountPrice": 199,
        "category": "Men",
        "subCategory": "T-Shirts",
        "brand": "Nike",
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Black", "White", "Blue"],
        "material": "Cotton",
        "images": ["https://example.com/image1.jpg"],
        "stock": 100,
        "featured": true,
        "newArrival": true,
        "rating": 4.5,
        "numReviews": 25,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 8. Get Single Product Details
**Endpoint:** `GET /products/:id`

**Description:** Get detailed information about a single product

**Example Request:**
```
GET /products/65a1b2c3d4e5f6789abc0df0
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "65a1b2c3d4e5f6789abc0df0",
      "name": "Men's Cotton T-Shirt",
      "description": "Comfortable 100% cotton t-shirt perfect for casual wear",
      "price": 299,
      "discountPrice": 199,
      "category": "Men",
      "subCategory": "T-Shirts",
      "brand": "Nike",
      "sizes": ["S", "M", "L", "XL"],
      "colors": ["Black", "White", "Blue"],
      "material": "Cotton",
      "images": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
        "https://example.com/image3.jpg"
      ],
      "stock": 100,
      "featured": true,
      "newArrival": true,
      "bestSeller": false,
      "rating": 4.5,
      "numReviews": 25,
      "tags": ["casual", "summer", "cotton"],
      "weight": "200g",
      "dimensions": {
        "length": 70,
        "width": 50,
        "height": 5
      },
      "careInstructions": "Machine wash cold, tumble dry low",
      "season": "Summer",
      "style": "Casual",
      "pattern": "Solid",
      "sleeveLength": "Short",
      "neckline": "Round Neck",
      "fit": "Regular",
      "createdBy": {
        "_id": "65a1b2c3d4e5f6789abc0def",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 9. Update Product (Admin Only)
**Endpoint:** `PUT /products/:id`

**Description:** Update product details (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Payload:** Same as create product (all fields optional)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "product": { /* updated product object */ }
  }
}
```

---

### 10. Delete Product (Admin Only)
**Endpoint:** `DELETE /products/:id`

**Description:** Delete a product (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### 11. Get Categories List
**Endpoint:** `GET /products/categories/list`

**Description:** Get all available categories, sub-categories, brands, sizes, colors, materials, and seasons

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "categories": ["Men", "Women", "Kids", "Accessories", "Footwear", "Sports"],
    "subCategories": ["T-Shirts", "Jeans", "Shirts", "Dresses", "Sneakers"],
    "brands": ["Nike", "Adidas", "Puma", "Levi's", "H&M"],
    "sizes": ["XS", "S", "M", "L", "XL", "XXL", "Free Size"],
    "colors": ["Black", "White", "Blue", "Red", "Green", "Yellow"],
    "materials": ["Cotton", "Polyester", "Denim", "Wool", "Silk"],
    "seasons": ["Summer", "Winter", "Spring", "Fall", "All Season"]
  }
}
```

---

## Cart APIs

### 12. Get User Cart
**Endpoint:** `GET /cart`

**Description:** Get current user's cart

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "cart": {
      "_id": "65a1b2c3d4e5f6789abc0df1",
      "user": "65a1b2c3d4e5f6789abc0def",
      "items": [
        {
          "_id": "65a1b2c3d4e5f6789abc0df2",
          "product": {
            "_id": "65a1b2c3d4e5f6789abc0df0",
            "name": "Men's Cotton T-Shirt",
            "images": ["https://example.com/image1.jpg"],
            "price": 299,
            "discountPrice": 199,
            "stock": 100
          },
          "quantity": 2,
          "size": "M",
          "color": "Black",
          "price": 199
        }
      ],
      "totalAmount": 398,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### 13. Add Item to Cart
**Endpoint:** `POST /cart`

**Description:** Add item to cart

**Headers:**
```
Authorization: Bearer <token>
```

**Payload:**
```json
{
  "productId": "65a1b2c3d4e5f6789abc0df0",
  "quantity": 2,
  "size": "M",
  "color": "Black"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cart": { /* updated cart object */ }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Insufficient stock"
}
```

---

### 14. Update Cart Item Quantity
**Endpoint:** `PUT /cart/:itemId`

**Description:** Update quantity of a cart item

**Headers:**
```
Authorization: Bearer <token>
```

**Payload:**
```json
{
  "quantity": 3
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Cart item updated",
  "data": {
    "cart": { /* updated cart object */ }
  }
}
```

---

### 15. Remove Item from Cart
**Endpoint:** `DELETE /cart/:itemId`

**Description:** Remove item from cart

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": {
    "cart": { /* updated cart object */ }
  }
}
```

---

### 16. Clear Cart
**Endpoint:** `DELETE /cart`

**Description:** Clear all items from cart

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Cart cleared",
  "data": {
    "cart": {
      "_id": "65a1b2c3d4e5f6789abc0df1",
      "user": "65a1b2c3d4e5f6789abc0def",
      "items": [],
      "totalAmount": 0
    }
  }
}
```

---

## Order & Checkout APIs

### 17. Get Checkout Summary / Preview
**Endpoint:** `POST /orders/summary`

**Description:** Preview items, price calculations, shipping, tax, stock availability, and shipping address without creating an order.

**Headers:**
```
Authorization: Bearer <token>
```

**Payload (Cart Preview - default):**
```json
{
  "addressId": "65a1b2c3d4e5f6789abc0df4"
}
```

**Payload (Custom Items Preview):**
```json
{
  "items": [
    {
      "productId": "65a1b2c3d4e5f6789abc0df0",
      "quantity": 2,
      "size": "M",
      "color": "Black"
    }
  ],
  "addressId": "65a1b2c3d4e5f6789abc0df4"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "product": "65a1b2c3d4e5f6789abc0df0",
        "name": "Men's Cotton T-Shirt",
        "image": "https://example.com/image1.jpg",
        "quantity": 2,
        "size": "M",
        "color": "Black",
        "price": 199,
        "totalPrice": 398,
        "inStock": true
      }
    ],
    "itemsPrice": 398,
    "shippingPrice": 50,
    "taxPrice": 71.64,
    "totalPrice": 519.64,
    "isAvailable": true,
    "unavailableItems": [],
    "shippingAddress": {
      "fullName": "John Doe",
      "phone": "+1234567890",
      "addressLine1": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    }
  }
}
```

---

### 18. Direct "Buy Now" Checkout
**Endpoint:** `POST /orders/direct`

**Description:** Create an instant order directly for a single item (bypassing user's cart)

**Headers:**
```
Authorization: Bearer <token>
```

**Payload (Using Saved Address ID):**
```json
{
  "productId": "65a1b2c3d4e5f6789abc0df0",
  "quantity": 1,
  "size": "M",
  "color": "Black",
  "paymentMethod": "COD",
  "addressId": "65a1b2c3d4e5f6789abc0df4"
}
```

**Payload (Using Custom Shipping Address):**
```json
{
  "productId": "65a1b2c3d4e5f6789abc0df0",
  "quantity": 1,
  "size": "M",
  "color": "Black",
  "paymentMethod": "Card",
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "+1234567890",
    "addressLine1": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  }
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Direct order placed successfully",
  "data": {
    "order": {
      "_id": "65a1b2c3d4e5f6789abc0df5",
      "user": "65a1b2c3d4e5f6789abc0def",
      "orderItems": [
        {
          "product": "65a1b2c3d4e5f6789abc0df0",
          "name": "Men's Cotton T-Shirt",
          "quantity": 1,
          "image": "https://example.com/image1.jpg",
          "price": 199,
          "size": "M",
          "color": "Black"
        }
      ],
      "paymentMethod": "COD",
      "itemsPrice": 199,
      "shippingPrice": 50,
      "taxPrice": 35.82,
      "totalPrice": 284.82,
      "orderStatus": "Processing"
    }
  }
}
```

---

### 19. Create Order (Cart Checkout)
**Endpoint:** `POST /orders`

**Description:** Create a new order from cart items (supports `addressId` or inline `shippingAddress`)

**Headers:**
```
Authorization: Bearer <token>
```

**Payload (Option A - Using Saved Address):**
```json
{
  "addressId": "65a1b2c3d4e5f6789abc0df4",
  "paymentMethod": "COD"
}
```

**Payload (Option B - Using Shipping Address Object):**
```json
{
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "+1234567890",
    "addressLine1": "123 Main Street",
    "addressLine2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "COD"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "order": {
      "_id": "65a1b2c3d4e5f6789abc0df3",
      "user": "65a1b2c3d4e5f6789abc0def",
      "orderItems": [
        {
          "product": {
            "_id": "65a1b2c3d4e5f6789abc0df0",
            "name": "Men's Cotton T-Shirt",
            "images": ["https://example.com/image1.jpg"]
          },
          "name": "Men's Cotton T-Shirt",
          "quantity": 2,
          "image": "https://example.com/image1.jpg",
          "price": 199,
          "size": "M",
          "color": "Black"
        }
      ],
      "shippingAddress": {
        "fullName": "John Doe",
        "phone": "+1234567890",
        "addressLine1": "123 Main Street",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "USA"
      },
      "paymentMethod": "COD",
      "paymentStatus": "Pending",
      "itemsPrice": 398,
      "shippingPrice": 50,
      "taxPrice": 71.64,
      "totalPrice": 519.64,
      "isPaid": false,
      "isDelivered": false,
      "orderStatus": "Processing",
      "statusHistory": [
        {
          "status": "Processing",
          "timestamp": "2024-01-15T10:30:00.000Z",
          "note": "Order placed successfully"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### 20. Process User Payment
**Endpoint:** `PUT /orders/:id/pay`

**Description:** Complete payment for a pending order by user

**Headers:**
```
Authorization: Bearer <token>
```

**Payload (Optional):**
```json
{
  "paymentMethod": "Card",
  "transactionId": "TXN987654321"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Payment completed successfully",
  "data": {
    "order": {
      "_id": "65a1b2c3d4e5f6789abc0df3",
      "isPaid": true,
      "paidAt": "2024-01-15T10:35:00.000Z",
      "paymentStatus": "Completed",
      "orderStatus": "Processing"
    }
  }
}
```

---

### 21. Cancel Order (User)
**Endpoint:** `PUT /orders/:id/cancel`

**Description:** Cancel an order placed by the user (only valid if order status is Processing or Confirmed). Restores stock.

**Headers:**
```
Authorization: Bearer <token>
```

**Payload (Optional):**
```json
{
  "reason": "Changed my mind"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "order": {
      "_id": "65a1b2c3d4e5f6789abc0df3",
      "orderStatus": "Cancelled",
      "paymentStatus": "Refunded"
    }
  }
}
```

---

### 22. Get User Orders
**Endpoint:** `GET /orders`

**Description:** Get all orders for the logged-in user

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response (Success - 200):**
```json
{
  "success": true,
  "count": 5,
  "total": 15,
  "page": 1,
  "pages": 3,
  "data": {
    "orders": [
      {
        "_id": "65a1b2c3d4e5f6789abc0df3",
        "orderItems": [],
        "totalPrice": 519.64,
        "orderStatus": "Processing",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 23. Get Single Order Details
**Endpoint:** `GET /orders/:id`

**Description:** Get detailed information about a specific order

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "order": { /* full order object with all details */ }
  }
}
```

---

### 24. Update Order Status (Admin Only)
**Endpoint:** `PUT /orders/:id/status`

**Description:** Update order status (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Payload:**
```json
{
  "status": "Shipped",
  "note": "Order has been shipped via courier"
}
```

**Status Options:** Processing, Confirmed, Shipped, Out for Delivery, Delivered, Cancelled, Returned

---

### 25. Update Payment Status (Admin Only)
**Endpoint:** `PUT /orders/:id/payment`

**Description:** Update payment status (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Payload:**
```json
{
  "paymentStatus": "Completed"
}
```

---

### 26. Get All Orders (Admin Only)
**Endpoint:** `GET /orders/admin/all`

**Description:** Get all orders in the system (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response (Success - 200):**
```json
{
  "success": true,
  "count": 20,
  "total": 150,
  "page": 1,
  "pages": 8,
  "data": {
    "orders": [
      {
        "_id": "65a1b2c3d4e5f6789abc0df3",
        "user": {
          "_id": "65a1b2c3d4e5f6789abc0def",
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "+1234567890"
        },
        "orderItems": [/* order items */],
        "totalPrice": 469.64,
        "orderStatus": "Processing",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

## Profile APIs

### 23. Get User Profile
**Endpoint:** `GET /profile`

**Description:** Get user profile details with addresses

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6789abc0def",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "phone": "+1234567890",
      "avatar": "https://example.com/avatar.jpg",
      "addresses": [
        {
          "_id": "65a1b2c3d4e5f6789abc0df4",
          "fullName": "John Doe",
          "phone": "+1234567890",
          "addressLine1": "123 Main Street",
          "addressLine2": "Apt 4B",
          "city": "New York",
          "state": "NY",
          "postalCode": "10001",
          "country": "USA",
          "isDefault": true
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### 24. Update User Profile
**Endpoint:** `PUT /profile`

**Description:** Update user profile information

**Headers:**
```
Authorization: Bearer <token>
```

**Payload:**
```json
{
  "name": "John Updated",
  "phone": "+9876543210",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { /* updated user object */ }
  }
}
```

---

### 25. Get User Addresses
**Endpoint:** `GET /profile/addresses`

**Description:** Get all addresses for the user

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "count": 2,
  "data": {
    "addresses": [
      {
        "_id": "65a1b2c3d4e5f6789abc0df4",
        "fullName": "John Doe",
        "phone": "+1234567890",
        "addressLine1": "123 Main Street",
        "addressLine2": "Apt 4B",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "USA",
        "isDefault": true,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 26. Add New Address
**Endpoint:** `POST /profile/addresses`

**Description:** Add a new address to the user's profile

**Headers:**
```
Authorization: Bearer <token>
```

**Payload:**
```json
{
  "fullName": "John Doe",
  "phone": "+1234567890",
  "addressLine1": "456 Oak Avenue",
  "addressLine2": "Suite 100",
  "city": "Los Angeles",
  "state": "CA",
  "postalCode": "90001",
  "country": "USA",
  "isDefault": false
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Address added successfully",
  "data": {
    "address": { /* created address object */ }
  }
}
```

---

### 27. Get Single Address
**Endpoint:** `GET /profile/addresses/:id`

**Description:** Get details of a specific address

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "address": { /* address object */ }
  }
}
```

---

### 28. Update Address
**Endpoint:** `PUT /profile/addresses/:id`

**Description:** Update an existing address

**Headers:**
```
Authorization: Bearer <token>
```

**Payload:** Same as add address (all fields optional)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": {
    "address": { /* updated address object */ }
  }
}
```

---

### 29. Delete Address
**Endpoint:** `DELETE /profile/addresses/:id`

**Description:** Delete an address

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

---

### 30. Set Default Address
**Endpoint:** `PUT /profile/addresses/:id/default`

**Description:** Set an address as the default address

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Default address updated successfully",
  "data": {
    "address": { /* updated address object */ }
  }
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message description",
  "error": {} // Additional error details (in development mode)
}
```

### Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation errors, invalid input)
- `401` - Unauthorized (Invalid or missing token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found (Resource doesn't exist)
- `500` - Internal Server Error

---

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecc_db
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
```

3. Start the server:
```bash
npm start
# or for development
npm run dev
```

4. Server will run on `http://localhost:5000`

---

## Database Models

### User Model
- `name` - String (required)
- `email` - String (required, unique)
- `password` - String (required, hashed)
- `role` - String (enum: user, admin, default: user)
- `phone` - String
- `avatar` - String (URL)
- `addresses` - Array of ObjectId (ref: Address)
- `createdAt` - Date
- `updatedAt` - Date

### Product Model
- `name` - String (required)
- `description` - String (required)
- `price` - Number (required)
- `discountPrice` - Number
- `category` - String (required, enum)
- `subCategory` - String (required)
- `brand` - String (required)
- `sizes` - Array of String
- `colors` - Array of String
- `material` - String (required)
- `images` - Array of String (URLs)
- `stock` - Number (required)
- `featured` - Boolean
- `newArrival` - Boolean
- `bestSeller` - Boolean
- `rating` - Number (0-5)
- `numReviews` - Number
- `tags` - Array of String
- `weight` - String
- `dimensions` - Object (length, width, height)
- `careInstructions` - String
- `season` - String (enum)
- `style` - String
- `pattern` - String
- `sleeveLength` - String (enum)
- `neckline` - String
- `fit` - String (enum)
- `createdBy` - ObjectId (ref: User)
- `createdAt` - Date
- `updatedAt` - Date

### Cart Model
- `user` - ObjectId (ref: User, required, unique)
- `items` - Array of Object (product, quantity, size, color, price)
- `totalAmount` - Number
- `createdAt` - Date
- `updatedAt` - Date

### Order Model
- `user` - ObjectId (ref: User, required)
- `orderItems` - Array of Object (product, name, quantity, image, price, size, color)
- `shippingAddress` - Object (fullName, phone, addressLine1, addressLine2, city, state, postalCode, country)
- `paymentMethod` - String (enum: COD, Card, UPI, Net Banking)
- `paymentStatus` - String (enum: Pending, Completed, Failed, Refunded)
- `itemsPrice` - Number
- `shippingPrice` - Number
- `taxPrice` - Number
- `totalPrice` - Number
- `isPaid` - Boolean
- `paidAt` - Date
- `isDelivered` - Boolean
- `deliveredAt` - Date
- `orderStatus` - String (enum: Processing, Confirmed, Shipped, Out for Delivery, Delivered, Cancelled, Returned)
- `statusHistory` - Array of Object (status, timestamp, note)
- `createdAt` - Date
- `updatedAt` - Date

### Address Model
- `user` - ObjectId (ref: User, required)
- `fullName` - String (required)
- `phone` - String (required)
- `addressLine1` - String (required)
- `addressLine2` - String
- `city` - String (required)
- `state` - String (required)
- `postalCode` - String (required)
- `country` - String (required, default: India)
- `isDefault` - Boolean (default: false)
- `createdAt` - Date
- `updatedAt` - Date
