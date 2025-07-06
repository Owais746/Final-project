# Final Project - E-commerce Platform

A modern e-commerce platform built with Node.js, Express, MongoDB, and EJS templating.

## Recent Improvements Made

### Frontend Improvements
- ✅ **Fixed cart image sizes** - Reduced large photos to compact 128x128px thumbnails
- ✅ **Improved cart layout** - Modern responsive design with better spacing
- ✅ **Added quantity controls** - Interactive +/- buttons for cart items
- ✅ **Enhanced UI** - Better visual hierarchy and user experience

### Backend Improvements
- ✅ **Enhanced authentication middleware** - Better error handling and token validation
- ✅ **Added input validation** - Email, password, and product data validation
- ✅ **Implemented rate limiting** - Protection against spam and abuse
- ✅ **Cart quantity management** - Full CRUD operations for cart items
- ✅ **Improved error handling** - Better error messages and logging
- ✅ **Security enhancements** - Input sanitization and validation

### New Features Added
- ✅ **Quantity management in cart** - Users can increase/decrease item quantities
- ✅ **Smart cart updates** - Automatic quantity updates without page reload
- ✅ **Rate limiting** - Different limits for auth, cart, and general operations
- ✅ **Input sanitization** - All user inputs are cleaned and validated

## Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   ```
   JWT_KEY=your_jwt_secret_key
   SESSION_KEY=your_session_secret_key
   NODE_ENV=development
   ```

3. Make sure MongoDB is running on localhost:27017

4. Start the application:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## API Endpoints

### Cart Management
- `GET /addtocart/:productid` - Add product to cart
- `GET /removefromcart/:productid` - Remove product from cart
- `POST /updatequantity/:productid` - Update product quantity in cart
- `GET /cart` - View cart

### Rate Limiting
- General: 100 requests per 15 minutes
- Authentication: 5 attempts per 15 minutes
- Cart operations: 20 requests per minute

## Security Features
- JWT authentication with token expiry handling
- Input validation and sanitization
- Rate limiting on sensitive endpoints
- Error handling without information leakage

## Technology Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: EJS templating, TailwindCSS
- **Authentication**: JWT tokens
- **Security**: express-rate-limit, validator

## Project Structure
```
├── config/          # Database configuration
├── controllers/     # Business logic
├── middleware/      # Custom middleware
├── models/          # Database models
├── public/          # Static files
├── routes/          # API routes
├── utils/           # Utility functions
├── views/           # EJS templates
└── app.js           # Main application file
```
