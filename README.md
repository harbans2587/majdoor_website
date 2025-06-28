# Majdoor - Worker-Employer Platform

A modern web application connecting skilled workers with employers, built with Next.js, MongoDB, and Tailwind CSS.

## Features

- **User Authentication** - Secure login/signup for workers and employers
- **Profile Management** - Detailed profiles with skills, experience, and company information
- **Job Management** - Post, search, and apply for jobs with advanced filtering
- **Application System** - Streamlined application process with status tracking
- **Rating & Reviews** - Mutual rating system for quality assurance
- **Payment Integration** - Secure payment processing (planned)
- **Responsive Design** - Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 13+ with TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Deployment**: Vercel-ready

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your values
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Check `.env.example` for required environment variables including:
- MongoDB connection string
- NextAuth configuration
- Email service credentials (optional)
- Stripe keys (for payments, optional)

## Project Structure

```
src/
├── app/                 # App Router pages and layouts
├── components/          # Reusable UI components
├── lib/                # Utilities and configurations
├── models/             # Database models
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## Development Status

This project is under active development. Core features including authentication, profiles, and job management are implemented.

## License

MIT