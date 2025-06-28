# Majdoor API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.majdoor.com/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Error Responses
All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Success Responses
All success responses follow this format:
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "worker", // or "employer"
  "phone": "+919876543210",
  "companyName": "Company Name" // required for employers
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

### Get Current User
```http
GET /auth/me
```
*Requires authentication*

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "worker",
    "isVerified": false,
    "averageRating": 0,
    "totalReviews": 0
  }
}
```

### Forgot Password
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### Reset Password
```http
PUT /auth/reset-password/:resettoken
```

**Request Body:**
```json
{
  "password": "new_password123"
}
```

### Update User Details
```http
PUT /auth/update-details
```
*Requires authentication*

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210",
  "bio": "Experienced construction worker"
}
```

### Update Password
```http
PUT /auth/update-password
```
*Requires authentication*

**Request Body:**
```json
{
  "currentPassword": "current_password",
  "newPassword": "new_password123"
}
```

## Job Endpoints

### Get All Jobs
```http
GET /jobs?page=1&limit=10&category=construction&location=Delhi
```

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of jobs per page
- `category` (optional): Filter by job category
- `location` (optional): Filter by location
- `search` (optional): Search term
- `budget_min` (optional): Minimum budget
- `budget_max` (optional): Maximum budget
- `duration` (optional): Job duration type

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [...],
    "total": 100,
    "page": 1,
    "pages": 10
  }
}
```

### Get Single Job
```http
GET /jobs/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "job_id",
    "title": "Construction Worker Needed",
    "description": "Job description...",
    "category": "construction",
    "employer": { ... },
    "location": { ... },
    "budget": { ... },
    "requirements": [...],
    "skills": [...],
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create Job (Employers Only)
```http
POST /jobs
```
*Requires authentication and employer role*

**Request Body:**
```json
{
  "title": "Construction Worker Needed",
  "description": "We need an experienced construction worker...",
  "category": "construction",
  "location": {
    "address": {
      "street": "123 Main St",
      "city": "Delhi",
      "state": "Delhi",
      "zipCode": "110001",
      "country": "India"
    },
    "coordinates": {
      "lat": 28.6139,
      "lng": 77.2090
    }
  },
  "budget": {
    "amount": 500,
    "currency": "INR",
    "type": "daily"
  },
  "duration": "temporary",
  "startDate": "2024-02-01",
  "requirements": ["2+ years experience", "Own tools"],
  "skills": ["construction", "masonry"]
}
```

### Update Job
```http
PUT /jobs/:id
```
*Requires authentication and job ownership*

### Delete Job
```http
DELETE /jobs/:id
```
*Requires authentication and job ownership*

## Application Endpoints

### Apply to Job (Workers Only)
```http
POST /applications
```
*Requires authentication and worker role*

**Request Body:**
```json
{
  "jobId": "job_id",
  "coverLetter": "I am interested in this position...",
  "proposedRate": {
    "amount": 450,
    "currency": "INR",
    "type": "daily"
  }
}
```

### Get Job Applications (Employers Only)
```http
GET /applications/job/:jobId
```
*Requires authentication and job ownership*

### Update Application Status (Employers Only)
```http
PUT /applications/:id/status
```
*Requires authentication and job ownership*

**Request Body:**
```json
{
  "status": "shortlisted", // pending, viewed, shortlisted, interview, hired, rejected
  "note": "Impressed with experience"
}
```

### Withdraw Application (Workers Only)
```http
DELETE /applications/:id
```
*Requires authentication and application ownership*

## Review Endpoints

### Create Review
```http
POST /reviews
```
*Requires authentication*

**Request Body:**
```json
{
  "revieweeId": "user_id",
  "jobId": "job_id",
  "applicationId": "application_id",
  "rating": 5,
  "title": "Excellent worker",
  "comment": "Very professional and completed work on time",
  "categories": {
    "punctuality": 5,
    "quality": 5,
    "communication": 4,
    "professionalism": 5
  }
}
```

### Get User Reviews
```http
GET /reviews/user/:userId
```

### Get Job Reviews
```http
GET /reviews/job/:jobId
```

## User Endpoints

### Get User Profile
```http
GET /users/:id
```

### Update User Profile
```http
PUT /users/profile
```
*Requires authentication*

### Get User's Jobs (Employers)
```http
GET /users/my-jobs
```
*Requires authentication and employer role*

### Get User's Applications (Workers)
```http
GET /users/my-applications
```
*Requires authentication and worker role*

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized (Authentication Required)
- `403` - Forbidden (Insufficient Permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to:
- 100 requests per 15 minutes per IP address
- Additional limits may apply for specific endpoints

## Response Headers

All API responses include these headers:
- `Content-Type: application/json`
- `X-RateLimit-Limit: 100`
- `X-RateLimit-Remaining: 99`
- `X-RateLimit-Reset: 1640995200`