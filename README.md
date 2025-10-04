# Expense Management System

A comprehensive full-stack expense management application with advanced features including multi-level approval workflows, AI-powered OCR receipt scanning, real-time currency conversion, and role-based access control.

## 🌟 Features

### Core Functionality
- **User Authentication & Authorization**: JWT-based secure authentication with role-based access control
- **Multi-Level Approval Workflows**: Configurable approval rules (Sequential, Percentage-based, Specific Approver, Hybrid)
- **AI-Powered OCR**: Receipt scanning with automatic data extraction using Google Gemini AI
- **Currency Management**: Real-time currency conversion with support for 190+ countries
- **Role-Based Dashboards**: Tailored interfaces for Admin, Manager, and Employee roles
- **Expense Tracking**: Comprehensive expense submission, tracking, and management
- **Team Management**: Hierarchical team structure with manager-employee relationships
- **Multi-Company Support**: Isolated data per company with company-specific configurations

### Advanced Features
- **Smart Approval Rules**: Dynamic approval routing based on amount, category, and custom conditions
- **Real-time Exchange Rates**: Integration with live currency APIs for accurate conversions
- **Receipt Processing**: AI-powered data extraction from receipt images
- **Audit Trail**: Complete tracking of expense status changes and approvals
- **Comment System**: Collaborative approval process with comments and feedback
- **Fallback Systems**: Offline currency data and robust error handling

## 🏗️ Architecture

### Project Structure
```
expense-management/
├── frontend/              # React.js Single Page Application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-specific page components
│   │   ├── store/         # Redux state management
│   │   └── api/           # API integration layer
│   └── package.json
├── backend/               # Node.js + Express REST API
│   ├── models/            # MongoDB Mongoose schemas
│   ├── routes/            # API route handlers
│   ├── middleware/        # Authentication & validation
│   └── server.js
├── components/            # Next.js UI components (shadcn/ui)
└── app/                   # Next.js application pages
```

### Database Schema (MongoDB)
- **Users**: Authentication, roles, company associations
- **Companies**: Multi-tenant company data with currency settings
- **Expenses**: Full expense lifecycle with approval tracking
- **Approval Rules**: Configurable workflow definitions
- **Countries/Currencies**: 190+ countries with currency mappings

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB Atlas** cluster or local MongoDB instance
- **npm** or **pnpm** package manager

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment Configuration:**
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-management
JWT_SECRET=your-super-secure-jwt-secret-key
GEMINI_API_KEY=your-google-gemini-api-key
```

4. **Start the backend server:**
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment Configuration:**
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

4. **Start the development server:**
```bash
npm start
```

The frontend application will be available at `http://localhost:3000`

### MongoDB Atlas Setup

1. **Create a MongoDB Atlas cluster** at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Configure network access** to allow connections from your IP
3. **Create a database user** with read/write permissions
4. **Get your connection string** and update the `MONGODB_URI` in your `.env` file

## 📋 API Endpoints

### Authentication
- `POST /auth/signup` - User registration with company creation
- `POST /auth/login` - User authentication
- `GET /auth/me` - Get current user profile

### User Management
- `GET /users` - List company users (Admin/Manager)
- `PUT /users/:id/role` - Update user role (Admin only)
- `PUT /users/:id/manager` - Assign manager (Admin only)

### Expense Management
- `POST /expenses` - Submit new expense
- `GET /expenses` - Get user's expenses
- `GET /expenses/pending` - Get pending approvals (Manager/Admin)
- `PUT /expenses/:id/approve` - Approve/reject expense
- `POST /expenses/:id/comment` - Add expense comment

### Approval Rules
- `POST /rules` - Create approval rule (Admin)
- `GET /rules` - List company approval rules
- `PUT /rules/:id` - Update approval rule (Admin)
- `DELETE /rules/:id` - Delete approval rule (Admin)

### OCR & Receipt Processing
- `POST /ocr/upload` - Upload and process receipt image

### Currency Management
- `GET /currency/countries` - List all countries with currencies
- `GET /currency/rates/:baseCurrency` - Get exchange rates
- `POST /currency/convert` - Convert between currencies

## 🎭 User Roles & Permissions

### Employee
- Submit and track personal expenses
- Upload receipts with OCR processing
- View expense history and status
- Add comments to expense submissions

### Manager
- All Employee permissions
- Approve/reject team member expenses
- Manage direct reports

### Admin
- All Manager permissions
- Complete user management
- Configure approval rules
- Access company-wide analytics
- Manage company settings and currency

## 🛠️ Technology Stack

### Frontend
- **React** 18.2.0 - Component-based UI framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **shadcn/ui** - Modern UI component library
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Secure authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Tesseract.js** - OCR text extraction
- **Google Gemini AI** - Advanced receipt processing

### External Services
- **MongoDB Atlas** - Cloud database hosting
- **Exchange Rate API** - Real-time currency conversion
- **REST Countries API** - Country and currency data
- **Google Gemini** - AI-powered receipt analysis

## 🔒 Security Features

- **JWT Authentication** with secure token management
- **Password Hashing** using bcryptjs
- **Role-based Access Control** (RBAC)
- **Input Validation** and sanitization
- **CORS Protection** for cross-origin requests
- **Environment Variable** management for sensitive data

## 🌐 Deployment Considerations

### Environment Variables
Ensure all required environment variables are properly configured:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Strong secret for JWT signing
- `GEMINI_API_KEY` - Google AI API key
- `PORT` - Server port (default: 5000)

### Production Optimizations
- Enable MongoDB connection pooling
- Implement rate limiting for API endpoints
- Configure proper CORS policies
- Set up logging and monitoring
- Enable HTTPS in production

## 📝 Default Setup

After initial signup, the first user automatically becomes the **Admin** for their company. Subsequent users joining the same company will have **Employee** role by default, which can be updated by the Admin.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

**Built with ❤️ using Modern Web Technologies**
