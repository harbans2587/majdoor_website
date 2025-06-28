# Majdoor - Worker-Employer Platform

A modern web application connecting skilled workers with employers, built with Next.js, MongoDB, and Tailwind CSS.

## 🚀 Features

### For Workers
- **Profile Management** - Showcase skills, experience, and portfolio
- **Job Search** - Find opportunities with advanced filtering
- **Application System** - Apply to jobs with personalized cover letters
- **Dashboard** - Track applications and profile views
- **Rating System** - Build reputation through client reviews

### For Employers  
- **Company Profiles** - Detailed company information and branding
- **Job Posting** - Create detailed job listings with requirements
- **Candidate Management** - Review applications and hire workers
- **Dashboard** - Manage all job postings and applications
- **Rating System** - Rate workers after project completion

### Platform Features
- **Secure Authentication** - JWT-based login with NextAuth.js
- **Responsive Design** - Mobile-friendly interface
- **Real-time Updates** - Live application and job status updates
- **Search & Filters** - Advanced job filtering by skills, location, budget
- **Payment Integration** - Ready for Stripe integration (planned)

## 🛠 Tech Stack

- **Frontend**: Next.js 13+ with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with JWT strategy
- **Deployment**: Vercel-ready configuration
- **Development**: ESLint, TypeScript strict mode

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/harbans2587/majdoor_website.git
   cd majdoor_website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/majdoor_db
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Import your repository on [Vercel](https://vercel.com)
   - Add environment variables in Vercel dashboard
   - Deploy automatically

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/majdoor_db
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret-key
```

## 📁 Project Structure

```
majdoor_website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── jobs/          # Job management
│   │   │   ├── profile/       # Profile management
│   │   │   └── applications/  # Application system
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── jobs/              # Job listing and details
│   │   ├── profile/           # Profile management
│   │   └── post-job/          # Job posting form
│   ├── components/            # Reusable UI components
│   │   ├── profile/           # Profile-specific components
│   │   └── ui/                # Generic UI components
│   ├── lib/                   # Utilities and configurations
│   ├── models/                # MongoDB/Mongoose models
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Helper functions
├── public/                    # Static assets
├── tailwind.config.js         # Tailwind CSS configuration
├── next.config.js             # Next.js configuration
└── package.json               # Dependencies and scripts
```

## 🎯 Usage

### For Workers

1. **Sign up** as a worker
2. **Complete your profile** with skills and experience
3. **Browse jobs** using filters
4. **Apply to jobs** with personalized cover letters
5. **Track applications** in your dashboard

### For Employers

1. **Sign up** as an employer
2. **Complete company profile** with business information
3. **Post jobs** with detailed requirements
4. **Review applications** from workers
5. **Manage hiring** through the dashboard

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Quality

- **ESLint**: Configured with Next.js recommended rules
- **TypeScript**: Strict mode enabled for type safety
- **Prettier**: Code formatting (recommended)

## 🗄 Database Schema

### Users Collection
- Basic user information (name, email, userType)
- Authentication data (hashed password)
- Profile completion status

### Worker Profiles
- Professional information (title, bio, skills)
- Experience and education history
- Portfolio and hourly rates
- Location and availability

### Employer Profiles
- Company information (name, description, industry)
- Contact details and location
- Company size and website

### Jobs Collection
- Job details (title, description, requirements)
- Budget and location information
- Skills required and experience level
- Application tracking

### Applications Collection
- Job application data
- Cover letters and proposed rates
- Application status tracking
- Timestamps for workflow

## 🔐 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure session management
- **Input Validation**: Server-side validation for all forms
- **SQL Injection Prevention**: MongoDB with parameterized queries
- **CSRF Protection**: Built-in with NextAuth.js

## 🚧 Roadmap

### Phase 1: Core Features ✅
- [x] User authentication and profiles
- [x] Job posting and search
- [x] Application system
- [x] Basic dashboard

### Phase 2: Enhanced Features
- [ ] Real-time messaging between users
- [ ] Advanced search with AI recommendations
- [ ] File upload for resumes and portfolios
- [ ] Email notifications system

### Phase 3: Advanced Features
- [ ] Payment integration with Stripe
- [ ] Video call integration for interviews
- [ ] Advanced analytics and reporting
- [ ] Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support and questions:
- Create an issue on GitHub
- Contact: [Your Email]
- Documentation: Check the wiki for detailed guides

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- Vercel for seamless deployment platform