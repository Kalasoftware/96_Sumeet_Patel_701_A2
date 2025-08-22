# Express.js Applications Collection

This repository contains 7 different Express.js applications as requested.

## Prerequisites

- Node.js installed
- MongoDB installed and running (for Q4, Q5, Q7)
- Redis installed and running (for Q3)

## Installation & Running

For each question (q1-q7), navigate to the respective folder and run:

```bash
cd q1
npm install
npm start
```

## Applications Overview

### Q1 - User Registration Form (Port 3000)
- **Features**: Registration form with file upload, validation, download functionality
- **Technologies**: Express, EJS, express-validator, multer
- **URL**: http://localhost:3000

### Q2 - File Session Store Login (Port 3001)
- **Features**: Login system with file-based session storage
- **Technologies**: Express, EJS, express-session, session-file-store
- **URL**: http://localhost:3001
- **Test Users**: admin/admin123, user/user123

### Q3 - Redis Session Store Login (Port 3002)
- **Features**: Login system with Redis session storage
- **Technologies**: Express, EJS, express-session, connect-redis
- **URL**: http://localhost:3002
- **Test Users**: admin/admin123, user/user123
- **Note**: Requires Redis server running

### Q4 - Admin ERP System (Port 3003)
- **Features**: Employee CRUD, salary calculation, email notifications
- **Technologies**: Express, EJS, Mongoose, bcrypt, nodemailer
- **URL**: http://localhost:3003
- **Admin**: admin/admin123
- **Note**: Requires MongoDB running

### Q5 - Employee JWT Site (Port 3004)
- **Features**: JWT authentication, employee profile, leave applications
- **Technologies**: Express, Mongoose, JWT, vanilla JS frontend
- **URL**: http://localhost:3004
- **Note**: Uses employees from Q4 database

### Q6 - Free API Integration (Port 3005)
- **Features**: Multiple free API integrations (quotes, jokes, cat facts, currency)
- **Technologies**: Express, Axios, vanilla JS frontend
- **URL**: http://localhost:3005

### Q7 - Shopping Cart System (Port 3006)
- **Features**: 2-level categories, products, admin panel, user cart
- **Technologies**: Express, EJS, Mongoose, sessions
- **URL**: http://localhost:3006
- **Admin**: admin/admin123
- **Note**: Requires MongoDB running

## Database Setup

For MongoDB applications (Q4, Q5, Q7), the applications will automatically connect to:
- Database: `erp_system` (Q4, Q5)
- Database: `shopping_cart` (Q7)

Make sure MongoDB is running on default port 27017.

## Notes

- All applications use minimal CSS for simplicity
- Error handling and validation included
- Session management implemented where required
- File uploads stored in `uploads/` directory (Q1)
- JWT tokens stored in localStorage (Q5)
- Email functionality is mocked in console (Q4)