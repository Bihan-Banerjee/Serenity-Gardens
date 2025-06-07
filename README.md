# Serenity Gardens

Serenity Gardens is a full-stack MERN web application designed to showcase a tranquil farmhouse retreat, offering users an interactive experience to explore, review, and purchase products such as fresh produce and fish directly from the source.

---

## 🌿 Overview

The project combines dynamic frontend components, secure authentication, admin functionality, and database-driven item management to deliver an engaging and functional user experience. Users can browse media, submit feedback, register and log in, view their past orders, and place new orders. Admins can manage catalog items and monitor orders through a dedicated dashboard.

---

## 🔧 Tech Stack

### Frontend
- **React** with **Vite**
- **TypeScript** and **JavaScript**
- **TailwindCSS** for styling
- **react-router-dom** for routing
- **react-hot-toast** for notifications
- **Cloudinary** for image storage
- **Sharp** for image optimization
- **styled-components** for styled animations and loaders

### Backend
- **Node.js** with **Express**
- **MongoDB** with **Mongoose**
- **JWT (JSON Web Tokens)** for authentication
- **Bcrypt** for password hashing
- **Razorpay** for payment integration
- **Multer** for file uploads
- **Sharp** for image compression
- **Cloudinary SDK** for uploads

---

## 🔑 Features

### General User Features
- **Landing Page with Loader Animation**
- **About Us Page** — with Focus Cards and Compare sliders
- **Explore Page** — dynamically displays fauna and flora
- **Gallery Page** — curated images and videos from Cloudinary
- **Reviews Page** — marquee-style testimonials and feedback form (stored in DB)
- **Shop/Login/Register** — Authentication system with JWT
- **Menu Page**:
  - View all available catalog items
  - Add to Cart and modify quantity
  - Repeat Last Order (if logged in)
  - Checkout page with multiple payment methods
- **My Profile Page**:
  - View past orders
  - Track payment status

### Admin Features
- **Admin Login Check** with persisted `isAdmin` state
- **Admin Panel**:
  - Toggle between Item Manager and Order Manager
  - Item Manager:
    - Add/Edit/Delete/Finalize items
    - Upload images with compression and Cloudinary integration
  - Order Manager:
    - View all orders
    - Mark orders as Paid
    - Delete unwanted orders

---

## 🔐 Authentication & Authorization

- JWT tokens stored in localStorage
- Admin panel protected with route-based checks and dynamic decoding
- Auth state managed globally using Context API for reliability

---

## 📝 Future Enhancements

- Razorpay payment gateway integration
- Admin analytics dashboard
- OTP-based login or Google Auth
- Enhanced search and filtering in menu
- Mobile-first design improvements
