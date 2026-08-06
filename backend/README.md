# E-Commerce Clothing Backend

A comprehensive backend API for an e-commerce clothing store built with MERN stack (MongoDB, Express, Node.js). Features include user authentication, product management, cart functionality, order processing, and profile management.

## Features

- **Authentication & Authorization**
  - User registration and login with JWT
  - Role-based access control (Admin/User)
  - Password change functionality
  - Profile management

- **Product Management**
  - CRUD operations for products (Admin only)
  - Advanced product model with 20+ fields
  - Product details page API
  - Advanced filtration (category, price, size, color, brand, etc.)
  - Search functionality
  - Pagination and sorting
  - Featured, new arrivals, and best seller filters

- **Cart Functionality**
  - Add items to cart
  - Update item quantities
  - Remove items from cart
  - Clear cart
  - Stock validation

- **Order Management**
  - Create orders from cart
  - Order status tracking
  - Payment status management
  - Order history for users
  - Admin order management
  - Automatic stock updates

- **Profile Management**
  - User profile updates
  - Address management (CRUD)
  - Default address setting
  - Avatar management

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing

## Project Structure

```
backend/
├── models/
│   ├── User.js          # User model with authentication
│   ├── Address.js       # Address model
│   ├── Product.js       # Product model with 20+ fields
│   ├── Cart.js          # Cart model
│   └── Order.js         # Order model
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── products.js      # Product routes
│   ├── cart.js          # Cart routes
│   ├── orders.js        # Order routes
│   └── profile.js       # Profile routes
├── middleware/
│   ├── auth.js          # JWT authentication middleware
│   └── errorHandler.js  # Error handling middleware
├── server.js            # Main server file
├── package.json         # Dependencies
├── .env.example         # Environment variables template
├── API_DOCUMENTATION.md # Complete API documentation
└── README.md            # This file
```

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecc_db
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   JWT_EXPIRE=7d
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system or use MongoDB Atlas.

6. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `PUT /auth/updateprofile` - Update profile
- `PUT /auth/changepassword` - Change password

### Products
- `POST /products` - Create product (Admin)
- `GET /products` - Get all products with filters
- `GET /products/:id` - Get single product
- `PUT /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)
- `GET /products/categories/list` - Get categories list

### Cart
- `GET /cart` - Get user cart
- `POST /cart` - Add item to cart
- `PUT /cart/:itemId` - Update cart item
- `DELETE /cart/:itemId` - Remove cart item
- `DELETE /cart` - Clear cart

### Orders
- `POST /orders` - Create order (checkout)
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get single order
- `PUT /orders/:id/status` - Update order status (Admin)
- `PUT /orders/:id/payment` - Update payment status (Admin)
- `GET /orders/admin/all` - Get all orders (Admin)

### Profile
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /profile/addresses` - Get user addresses
- `POST /profile/addresses` - Add address
- `GET /profile/addresses/:id` - Get single address
- `PUT /profile/addresses/:id` - Update address
- `DELETE /profile/addresses/:id` - Delete address
- `PUT /profile/addresses/:id/default` - Set default address

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Product Fields

The product model includes 20+ fields for comprehensive product information:

- **Basic Info**: name, description, price, discountPrice
- **Classification**: category, subCategory, brand
- **Variants**: sizes, colors
- **Details**: material, stock, weight, dimensions
- **Marketing**: featured, newArrival, bestSeller, tags
- **Product Specifics**: careInstructions, season, style, pattern, sleeveLength, neckline, fit
- **Reviews**: rating, numReviews
- **Images**: images array (URLs)

## Database Models

### User
- Authentication with bcrypt password hashing
- Role-based access (user/admin)
- Profile information
- Address management

### Product
- 20+ fields for comprehensive product data
- Text search indexing
- Category and brand indexing
- Stock management

### Cart
- User-specific cart
- Item quantity management
- Size and color variants
- Automatic total calculation

### Order
- Complete order tracking
- Status history
- Payment management
- Shipping information
- Automatic stock updates

### Address
- Multiple addresses per user
- Default address support
- Complete shipping information

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": {}
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Validation

Input validation is performed using express-validator. Required fields are validated before processing.

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control
- Input validation
- CORS enabled
- Error handling middleware

## Documentation

Complete API documentation with examples is available in `API_DOCUMENTATION.md`

## Development

### Adding New Endpoints

1. Create the route in the appropriate routes file
2. Add validation if needed
3. Implement the logic
4. Update the API documentation

### Adding New Models

1. Create a new model file in the `models/` directory
2. Define the schema with appropriate fields
3. Add any necessary middleware
4. Import and use in routes

## Testing

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- cURL
- Any HTTP client

## License

ISC

## Support

For issues or questions, please refer to the API documentation or create an issue in the repository.
