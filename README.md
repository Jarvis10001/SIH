# SIH Fullstack Application

A modern fullstack web application built with React frontend and Node.js backend.

## 🏗️ Project Structure

```
SIH/
├── frontend/          # React + Vite application
│   ├── src/          # React components and logic
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── backend/          # Node.js + Express API
│   ├── routes/       # API route definitions
│   ├── controllers/  # Business logic handlers
│   ├── middleware/   # Custom middleware functions
│   ├── server.js     # Main server entry point
│   └── package.json  # Backend dependencies
└── .vscode/          # VS Code workspace configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v20.19+ or v22.12+)
- npm or yarn

### Installation & Setup

1. **Install dependencies for both frontend and backend:**
   ```bash
   # Frontend
   cd frontend && npm install
   
   # Backend
   cd ../backend && npm install
   ```

2. **Start development servers:**
   ```bash
   # Option 1: Start both servers using VS Code task "Start Both Servers"
   
   # Option 2: Start manually in separate terminals
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend  
   cd frontend && npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173/
   - Backend API: http://localhost:5000/

## 🛠️ Available Scripts

### Frontend (React + Vite)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend (Node.js + Express)
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| GET | `/api/health` | Health check |
| GET | `/api/data` | Sample data |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |

## 🔧 VS Code Integration

This project includes VS Code tasks for streamlined development:

- **Start Frontend Dev Server** - Launch React development server
- **Start Backend Dev Server** - Launch Express server with nodemon
- **Start Both Servers** - Launch both servers in parallel
- **Build Frontend** - Create production build
- **Install Dependencies** - Install packages for frontend/backend

Access tasks via: `Ctrl+Shift+P` → `Tasks: Run Task`

## 🌐 Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **JavaScript** - Programming language
- **ESLint** - Code linting

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **nodemon** - Development auto-restart

## 📝 Environment Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
```

## 🤝 Development Workflow

1. **Frontend Development**: Make changes in `frontend/src/`
2. **Backend Development**: Make changes in `backend/`
3. **API Integration**: Update API calls in frontend to match backend endpoints
4. **Testing**: Test both frontend and backend functionality
5. **Build**: Use `npm run build` in frontend for production builds

## 📚 Next Steps

- Add database integration (MongoDB, PostgreSQL, etc.)
- Implement user authentication
- Add unit and integration tests
- Set up CI/CD pipeline
- Deploy to cloud platform

---

Happy coding! 🎉
