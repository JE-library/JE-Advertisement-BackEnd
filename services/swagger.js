const swaggerAutogen = require("swagger-autogen")();
require("dotenv").config()

const doc = {
  info: {
    title: "library Management App",
    description: `
    
    This backend powers an Advertisement Web Application with role-based access control and RESTful API design.

### 🔐 Authentication & Authorization
- Supports user roles: **vendors** and **regular users**
- **Vendors** can create, update, and delete adverts
- **Regular users** can view adverts only
- Secure signup and login endpoints

### 📦 Core Features
- **Advert Management**: Create, read, update, delete adverts
- **User Management**: Sign up, login with role-based permissions
- **Image Uploads**: Vendors can upload images with their adverts
- **Search & Filtering**: Search adverts by title, category, or price

### 📘 API Endpoints Overview
- POST /adverts - Create advert (vendors only)
- GET /adverts - View all adverts
- GET /adverts/:id - View single advert
- PUT /adverts/:id - Update advert (vendors only)
- DELETE /adverts/:id - Delete advert (vendors only)
- POST /auth/signup & POST /auth/login - User registration & login

All endpoints are secured and follow REST principles, making it easy to integrate with any frontend or mobile app.  
    `,
  },
  //   host: "je-library-backend.onrender.com",
  host: `localhost:${process.env.PORT}`,
  schemes: ["http", "https"],
};

const outputFile = "./swagger-output.json ";
const routes = ["../app.js"];

swaggerAutogen(outputFile, routes, doc);
