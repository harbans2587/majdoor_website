# Development Setup Guide

This guide will help you set up the Majdoor platform for local development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/harbans2587/majdoor_website.git
cd majdoor_website
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit the .env file with your configuration
# Minimum required:
# - MONGODB_URI
# - JWT_SECRET
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit the .env.local file
# Set NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Database Setup

If using local MongoDB:
```bash
# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

If using MongoDB Atlas:
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Get your connection string
- Update `MONGODB_URI` in backend/.env

### 5. Start the Applications

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## Environment Configuration

### Backend (.env)

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/majdoor

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=info
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## Development Tools

### Recommended VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- Thunder Client (for API testing)
- MongoDB for VS Code

### API Testing

Use Thunder Client or Postman to test API endpoints:

**Sample Requests:**

1. **Register User**
   ```
   POST http://localhost:5000/api/auth/register
   Content-Type: application/json

   {
     "email": "test@example.com",
     "password": "password123",
     "firstName": "John",
     "lastName": "Doe",
     "role": "worker"
   }
   ```

2. **Login**
   ```
   POST http://localhost:5000/api/auth/login
   Content-Type: application/json

   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. **Get Jobs**
   ```
   GET http://localhost:5000/api/jobs
   ```

## Database Management

### Using MongoDB Compass

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to: `mongodb://localhost:27017`
3. Navigate to the `majdoor` database

### Command Line

```bash
# Connect to MongoDB
mongo

# Use majdoor database
use majdoor

# View collections
show collections

# Query users
db.users.find()

# Query jobs
db.jobs.find()
```

## Testing

### Backend Testing

```bash
cd backend

# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

### Frontend Testing

```bash
cd frontend

# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## Code Quality

### Linting

```bash
# Backend linting
cd backend
npm run lint

# Frontend linting
cd frontend
npm run lint
```

### Code Formatting

The project uses Prettier for code formatting. Configure your editor to format on save.

```bash
# Format code manually
npm run format
```

## Common Development Tasks

### Adding New API Endpoints

1. Create controller in `backend/src/controllers/`
2. Add routes in `backend/src/routes/`
3. Add validation if needed
4. Test the endpoint
5. Update API documentation

### Adding New Pages

1. Create page component in `frontend/src/app/`
2. Add navigation links if needed
3. Connect to Redux store if needed
4. Style with Tailwind CSS

### Database Migrations

When changing database schemas:

1. Update the model in `backend/src/models/`
2. Create migration script if needed
3. Update seed data if applicable
4. Test with existing data

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 3000 or 5000
   lsof -ti:3000 | xargs kill -9
   lsof -ti:5000 | xargs kill -9
   ```

2. **MongoDB connection failed**
   - Check if MongoDB is running
   - Verify connection string in .env
   - Check firewall settings

3. **Module not found errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Build errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

### Environment Issues

1. **Environment variables not loading**
   - Restart the development server
   - Check file names (.env vs .env.local)
   - Verify no spaces around = in env files

2. **CORS errors**
   - Check FRONTEND_URL in backend .env
   - Verify NEXT_PUBLIC_API_URL in frontend .env.local

### Getting Help

1. Check the console for error messages
2. Look at network tab in browser dev tools
3. Check server logs in the terminal
4. Review this documentation
5. Search for similar issues on GitHub
6. Open an issue if problem persists

## Development Workflow

### Git Workflow

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -m "Add new feature"`
3. Push branch: `git push origin feature/new-feature`
4. Create pull request
5. Merge after review

### Code Review Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] Mobile responsive (for frontend)
- [ ] API responses properly handled
- [ ] Error cases handled
- [ ] Security considerations addressed

## Performance Tips

### Frontend

- Use Next.js Image component for images
- Implement lazy loading for heavy components
- Optimize bundle size with code splitting
- Use React.memo for expensive components

### Backend

- Add database indexes for frequently queried fields
- Implement pagination for large datasets
- Use MongoDB aggregation for complex queries
- Add caching where appropriate

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Redux Toolkit Guide](https://redux-toolkit.js.org/tutorials/quick-start)

For questions or support, contact: dev@majdoor.com