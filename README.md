# Majdoor - Complete Worker-Employer Platform

A comprehensive platform that connects workers (majdoor) with employers, featuring a modern web application with full-stack implementation including authentication, job posting, application management, and rating systems.

## 🚀 Features

### Authentication & User Management
- Multi-step registration for workers and employers
- JWT-based secure authentication
- Role-based access control (Worker/Employer/Admin)
- Password reset with email verification
- User profile management with portfolio upload

### Job Management System
- Create and manage detailed job listings
- Advanced search and filtering by location, category, budget
- Real-time job status tracking
- Featured and urgent job promotions
- Job categories: Construction, Cleaning, Delivery, and more

### Application & Hiring Workflow
- Apply to jobs with custom cover letters
- Application status tracking (Pending → Viewed → Shortlisted → Hired)
- Employer dashboard for managing applications
- Interview scheduling system
- Bulk application management

### Rating & Review System
- Dual rating system (Workers ↔ Employers)
- Detailed category-based reviews
- Review moderation and flagging
- Trust scores and verification badges

### Smart Search & Matching
- Location-based job discovery
- Skill-based matching algorithm
- Saved searches and job alerts
- Real-time notifications

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Hook Form** - Form validation and handling
- **Heroicons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Winston** - Logging
- **Joi** - Input validation

### Security & Performance
- Helmet.js for security headers
- Rate limiting to prevent abuse
- CORS configuration
- Input sanitization and validation
- Password hashing with salt

## 📁 Project Structure

```
majdoor-app/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   ├── components/      # Reusable UI components
│   │   ├── store/           # Redux store and slices
│   │   ├── services/        # API service functions
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   └── styles/          # Global CSS styles
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── tests/               # Test files
│   └── package.json
├── database/                 # Database related files
│   ├── migrations/          # Database migrations
│   ├── seeds/               # Seed data
│   └── schemas/             # Database schemas
└── docs/                    # Documentation
    ├── api/                 # API documentation
    ├── setup/               # Setup guides
    └── user-guide/          # User guides
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/harbans2587/majdoor_website.git
   cd majdoor_website
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file in backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/majdoor
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:3000
   ```

   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

   Create `.env.local` file in frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Database Setup**
   - Make sure MongoDB is running on your system
   - The application will automatically create the database and collections

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 📊 Database Schema

### User Model
- Personal information (name, email, phone, address)
- Role-based fields (worker skills, employer company info)
- Profile management (bio, profile picture, portfolio)
- Rating and review tracking
- Authentication and security fields

### Job Model
- Job details (title, description, requirements)
- Location and budget information
- Application tracking and statistics
- Status management and visibility settings
- Search optimization with keywords

### Application Model
- Job application workflow
- Status tracking with history
- Interview scheduling
- Document attachments
- Rating system integration

### Review Model
- Dual rating system (worker ↔ employer)
- Category-based ratings
- Review moderation and flagging
- Helpful vote system

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Password reset request
- `PUT /api/auth/reset-password/:token` - Reset password

### Jobs
- `GET /api/jobs` - Get all jobs with filters
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create new job (employers only)
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications
- `POST /api/applications` - Apply to job (workers only)
- `GET /api/applications/job/:jobId` - Get job applications
- `PUT /api/applications/:id/status` - Update application status

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/user/:userId` - Get user reviews
- `GET /api/reviews/job/:jobId` - Get job reviews

## 🔒 Security Features

- **Authentication**: JWT-based authentication with secure token handling
- **Authorization**: Role-based access control for different user types
- **Input Validation**: Comprehensive input validation using Joi
- **Rate Limiting**: API rate limiting to prevent abuse
- **Password Security**: Bcrypt hashing with salt rounds
- **CORS**: Properly configured cross-origin resource sharing
- **Security Headers**: Helmet.js for security headers

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Interface**: Clean and intuitive user interface
- **Real-time Updates**: Live notifications and status updates
- **Search & Filters**: Advanced search with multiple filter options
- **Interactive Elements**: Smooth animations and transitions
- **Accessibility**: WCAG compliant design principles

## 🚀 Deployment

### Development
Both frontend and backend can be run in development mode with hot reloading enabled.

### Production
1. Build the frontend application
2. Configure production environment variables
3. Set up MongoDB database
4. Deploy backend API server
5. Deploy frontend to hosting platform
6. Configure SSL/HTTPS
7. Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@majdoor.com
- GitHub Issues: [Create an issue](https://github.com/harbans2587/majdoor_website/issues)

## 🙏 Acknowledgments

- Icons by [Heroicons](https://heroicons.com/)
- UI components inspired by [Tailwind UI](https://tailwindui.com/)
- Authentication patterns from [Next.js documentation](https://nextjs.org/docs)

---

**Majdoor** - Connecting workers with opportunities across India 🇮🇳