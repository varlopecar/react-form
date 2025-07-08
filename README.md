# React Form with Blog Posts & User Management

A comprehensive React application with user registration, blog posts, and admin management features.

## 🚀 Features

### **Blog Posts System**
- **View Posts**: Browse all blog posts on the main page
- **Create Posts**: Admins can create new blog posts
- **Edit Posts**: Admins can edit existing posts
- **Delete Posts**: Admins can delete posts
- **Responsive Design**: Beautiful card-based layout

### **User Management System**
- **User Registration**: Complete registration form with validation
- **User Authentication**: Login system with JWT tokens
- **Admin Panel**: Full user management for administrators
- **User Details**: View complete user information
- **User Deletion**: Admins can delete users (except other admins)

### **Admin Features**
- **Dashboard**: Comprehensive admin interface
- **User Management**: Create, view, and delete users
- **Post Management**: Full CRUD operations on blog posts
- **Search & Filter**: Advanced search capabilities
- **Privacy Protection**: Masked sensitive information

## 🏗️ Architecture

### **Frontend (React + TypeScript)**
- **Main Page**: Blog posts display with tabbed interface
- **User Management**: Admin-only user management section
- **Authentication**: Login/logout functionality
- **Responsive UI**: Material-UI components

### **Backend APIs**
- **Python/FastAPI**: User management and authentication
- **Node.js/MongoDB**: Blog posts management
- **JWT Authentication**: Secure token-based auth
- **CORS Support**: Cross-origin request handling

## 📋 Requirements

### **Frontend Dependencies**
```bash
npm install
# or
pnpm install
```

### **Backend Dependencies**
```bash
# Python API
cd backend
pip install -r requirements.txt

# Node.js API (separate deployment)
# Already deployed at: https://express-mongodb-app-blush.vercel.app
```

## ⚙️ Configuration

### **Environment Variables**

Create a `.env.local` file in the root directory:

```bash
# Frontend API URL (Python/FastAPI)
VITE_API_URL=http://localhost:8000

# Blog API URL (Node.js/MongoDB)
VITE_BLOG_API_URL=https://express-mongodb-app-blush.vercel.app
```

### **Database Configuration**

The Python API uses MySQL. Configure in `env.example`:

```bash
MYSQL_DATABASE=user_registration
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_HOST=your_host
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

## 🚀 Getting Started

### **1. Start the Backend**
```bash
cd backend
python app.py
```

### **2. Start the Frontend**
```bash
pnpm dev
```

### **3. Access the Application**
- **Main Page**: http://localhost:5173 (Blog posts)
- **Admin Login**: http://localhost:5173/admin/login
- **User Login**: http://localhost:5173/login

## 📱 Usage

### **For Regular Users**
1. Visit the main page to browse blog posts
2. Register for an account if needed
3. Login to access additional features

### **For Administrators**
1. Login with admin credentials
2. Access the "User Management" tab
3. Create, view, and manage users
4. Create, edit, and delete blog posts
5. View detailed user information

## 🔧 API Endpoints

### **User Management API (Python/FastAPI)**
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /users` - Get all users (admin only)
- `DELETE /users/{id}` - Delete user (admin only)
- `GET /health` - Health check

### **Blog Posts API (Node.js/MongoDB)**
- `GET /posts` - Get all posts
- `POST /posts` - Create new post
- `PUT /posts/{id}` - Update post
- `DELETE /posts/{id}` - Delete post

## 🎨 UI Components

### **PostsSection**
- Displays blog posts in a grid layout
- Create/edit/delete functionality for admins
- Responsive card design
- Loading states and error handling

### **UsersSection**
- Table-based user management
- Search and filter functionality
- User creation and deletion
- Detailed user information modal

### **HomePage**
- Tabbed interface for posts and users
- Admin authentication check
- Navigation and logout functionality

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt password encryption
- **Admin Protection**: Admin-only features
- **Input Validation**: Comprehensive form validation
- **CORS Configuration**: Secure cross-origin requests

## 🧪 Testing

### **Run Tests**
```bash
pnpm test
```

### **Run E2E Tests**
```bash
pnpm run cypress:open
```

## 📦 Deployment

### **Frontend (Vercel)**
```bash
pnpm build
# Deploy to Vercel
```

### **Backend (Vercel)**
```bash
# Backend is already configured for Vercel deployment
# Uses vercel.json and vercel.py
```

## 🐛 Troubleshooting

### **Common Issues**
1. **CORS Errors**: Check environment variables and API URLs
2. **Database Connection**: Verify database credentials
3. **Authentication**: Ensure JWT secret is configured
4. **Blog API**: Verify the Node.js API is accessible

### **Debug Mode**
Enable debug logging in the backend:
```bash
LOG_LEVEL=debug
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting guide
2. Review the API documentation
3. Check the logs for error details
