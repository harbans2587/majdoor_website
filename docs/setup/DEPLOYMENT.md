# Deployment Guide for Majdoor Platform

This guide provides step-by-step instructions for deploying the Majdoor platform to production.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB database (MongoDB Atlas recommended)
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Environment
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/majdoor?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=30d

# Frontend URL
FRONTEND_URL=https://your-domain.com

# Email Configuration
EMAIL_FROM=noreply@your-domain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis (for caching and sessions)
REDIS_URL=redis://localhost:6379

# Payment Gateway (Razorpay for India)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Logging
LOG_LEVEL=info
```

### Frontend Environment Variables

Create a `.env.production` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-domain.com
```

## Deployment Options

### Option 1: VPS/Cloud Server Deployment

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y

# Install MongoDB (if not using MongoDB Atlas)
# See MongoDB official documentation for installation
```

#### 2. Clone and Setup Application

```bash
# Clone repository
git clone https://github.com/harbans2587/majdoor_website.git
cd majdoor_website

# Backend setup
cd backend
npm install --production
cp .env.example .env
# Edit .env with your production values

# Frontend setup
cd ../frontend
npm install
cp .env.example .env.production
# Edit .env.production with your production values
npm run build

# Create PM2 ecosystem file
cd ..
```

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'majdoor-backend',
      script: './backend/src/server.js',
      cwd: './backend',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      instances: 'max',
      exec_mode: 'cluster'
    },
    {
      name: 'majdoor-frontend',
      script: 'npm',
      args: 'start',
      cwd: './frontend',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log'
    }
  ]
};
```

#### 3. Start Applications

```bash
# Create logs directory
mkdir logs

# Start applications with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup
```

#### 4. Configure Nginx

Create `/etc/nginx/sites-available/majdoor`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/majdoor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. SSL Certificate with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Option 2: Docker Deployment

#### 1. Build Docker Images

```bash
# Build backend image
cd backend
docker build -t majdoor-backend .

# Build frontend image
cd ../frontend
docker build -t majdoor-frontend .
```

#### 2. Use Docker Compose

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Option 3: Cloud Platform Deployment

#### Vercel (Frontend)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

#### Railway/Heroku (Backend)

1. Create new app
2. Connect GitHub repository
3. Set environment variables
4. Deploy

#### MongoDB Atlas (Database)

1. Create cluster on MongoDB Atlas
2. Configure network access
3. Create database user
4. Get connection string

## Post-Deployment Checklist

### 1. Database Setup

```javascript
// Connect to MongoDB and run these commands
use majdoor

// Create indexes for better performance
db.jobs.createIndex({ "location.coordinates": "2dsphere" })
db.jobs.createIndex({ "category": 1 })
db.jobs.createIndex({ "status": 1 })
db.jobs.createIndex({ "employer": 1 })
db.jobs.createIndex({ "createdAt": -1 })

db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "address.coordinates": "2dsphere" })

db.applications.createIndex({ "job": 1, "applicant": 1 }, { unique: true })
db.applications.createIndex({ "employer": 1, "status": 1 })

db.reviews.createIndex({ "reviewee": 1, "isVisible": 1 })
db.reviews.createIndex({ "reviewer": 1, "reviewee": 1, "job": 1 }, { unique: true })
```

### 2. Security Configuration

- Enable firewall and close unnecessary ports
- Set up fail2ban for SSH protection
- Configure MongoDB authentication
- Enable HTTPS everywhere
- Set up rate limiting
- Configure CORS properly

### 3. Monitoring Setup

```bash
# Install monitoring tools
npm install -g pm2-logrotate
pm2 install pm2-server-monit

# Set up log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### 4. Backup Strategy

```bash
#!/bin/bash
# backup-script.sh

# MongoDB backup
mongodump --uri="your_mongodb_uri" --out="/backups/$(date +%Y%m%d_%H%M%S)"

# File backup
tar -czf "/backups/files_$(date +%Y%m%d_%H%M%S).tar.gz" /path/to/uploaded/files

# Clean old backups (keep 30 days)
find /backups -name "*.tar.gz" -mtime +30 -delete
find /backups -type d -mtime +30 -exec rm -rf {} +
```

### 5. Performance Optimization

- Enable gzip compression in Nginx
- Set up CDN for static assets
- Configure Redis for caching
- Optimize images with compression
- Enable browser caching

### 6. Testing

- Test all API endpoints
- Verify authentication flows
- Check file upload functionality
- Test email sending
- Verify payment integration
- Test on different devices

## Maintenance

### Regular Updates

```bash
# Update dependencies
cd backend && npm update
cd ../frontend && npm update

# Restart applications
pm2 restart all

# Update system packages
sudo apt update && sudo apt upgrade -y
```

### Monitoring Commands

```bash
# Check application status
pm2 status
pm2 logs

# Monitor system resources
htop
df -h
free -m

# Check Nginx status
sudo systemctl status nginx
sudo nginx -t

# Check SSL certificate
sudo certbot certificates
```

### Backup Verification

- Regularly test backup restoration
- Verify database integrity
- Check file backup completeness

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **MongoDB Connection Issues**
   - Check connection string
   - Verify network access in MongoDB Atlas
   - Check firewall settings

3. **SSL Certificate Issues**
   ```bash
   sudo certbot renew --dry-run
   sudo systemctl restart nginx
   ```

4. **High Memory Usage**
   ```bash
   pm2 reload all
   pm2 monit
   ```

### Log Locations

- Application logs: `./logs/`
- Nginx logs: `/var/log/nginx/`
- System logs: `/var/log/`
- PM2 logs: `~/.pm2/logs/`

For support, contact: support@majdoor.com