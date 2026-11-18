# ShopEase – MERN E-Commerce Website

A full-stack E-Commerce web application built using the MERN Stack (MongoDB, Express.js, React.js, and Node.js).

## Features

- User Registration and Login
- JWT Authentication
- Product Listing and Search
- Product Details
- Shopping Cart
- Checkout with Cash on Delivery
- Order Placement and My Orders
- Order Status Management
- Admin Dashboard
- Product Management (Add, Edit, Delete)
- Responsive User Interface

## Technologies Used

**Frontend**
- React.js
- Vite
- CSS
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt.js

## Project Structure

```text
E-Commerce/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone Repository

```bash
git clone https://github.com/yadavamit4git/ShopEase-E-Commerce.git
```

### 2. Backend Setup

```bash
cd ShopEase-E-Commerce/server
npm install
```

Create a `.env` file inside the server folder:

```env
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/EcommerceDB
JWT_SECRET=your_secure_secret
```

Start the backend:

```bash
npm start
```

### 3. Frontend Setup

Open another terminal:

```bash
cd ShopEase-E-Commerce/client
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Database

This project uses MongoDB as its database.

Database name: `EcommerceDB`

## GitHub Repository

https://github.com/yadavamit4git/ShopEase-E-Commerce

## Author

**Amit Yadav**

GitHub: https://github.com/yadavamit4git

---

*ShopEase – A Full Stack MERN E-Commerce Project.*