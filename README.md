# Expense Management System

A full-stack expense management application with multi-level approval workflows, OCR receipt scanning, and currency conversion.

## Project Structure

\`\`\`
expense-management/
├── frontend/          # React.js application
├── backend/           # Node.js + Express API
└── README.md
\`\`\`

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file in the backend directory:
\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-management
JWT_SECRET=your-secret-key-change-this
GOOGLE_VISION_API_KEY=your-google-vision-api-key (optional)
\`\`\`

4. Start the backend server:
\`\`\`bash
npm start
\`\`\`

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file in the frontend directory:
\`\`\`env
REACT_APP_API_URL=http://localhost:5000
\`\`\`

4. Start the frontend development server:
\`\`\`bash
npm start
\`\`\`

The frontend will run on `http://localhost:3000`

## Features

- **Authentication**: JWT-based signup/login system
- **Role-Based Access**: Admin, Manager, and Employee roles
- **Expense Management**: Submit, track, and manage expenses
- **Multi-Level Approvals**: Sequential and conditional approval workflows
- **OCR Integration**: Auto-fill expense details from receipt images
- **Currency Conversion**: Automatic conversion to company currency
- **Approval Rules**: Configurable approval workflows

## Default Admin Account

After signup, the first user becomes the Admin of their company.

## Tech Stack

**Frontend:**
- React.js (JSX only)
- React Router
- Redux Toolkit
- Axios
- TailwindCSS

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Tesseract.js (OCR)
