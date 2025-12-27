# Job Portal Web Application

Full-stack job portal application built with React, Node.js, Express, and PostgreSQL.

## Features

### 👤 Candidate
- Register and login
- Search jobs by title, company, or location
- View job details (including salary, skills required, applicant count, recruiter email)
- Apply for jobs (with resume upload required)
- Upload resume (PDF format)
- View applied jobs status
- See number of applicants for each job

### 🧑‍💼 Recruiter
- Register and login
- Post new jobs with title, company, location, description, salary, and skills required
- View all posted jobs
- View applications for each job
- See applicant count for each job
- Download candidate resumes
- Delete own posted jobs

### 🛠️ Admin
- Admin dashboard with analytics
- View all users, jobs, and applications
- Delete users or jobs
- View statistics and insights

## Tech Stack

- **Frontend**: React, React Router, CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer for PDF resume uploads
- **Password Hashing**: bcrypt

## Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE job_portal;
```

2. Run the schema file:
```bash
psql -U postgres -d job_portal -f backend/database/schema.sql
```

Or use your preferred PostgreSQL client to execute `backend/database/schema.sql`.

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@localhost:5432/job_portal
JWT_SECRET=your_secret_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Jobs
- `GET /api/jobs` - Get all jobs (with pagination and search)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job (Recruiter only)
- `GET /api/jobs/recruiter/my-jobs` - Get recruiter's jobs
- `DELETE /api/jobs/recruiter/:id` - Delete job (Recruiter only)
- `POST /api/jobs/:id/apply` - Apply to job (Candidate only)
- `GET /api/jobs/applied/list` - Get applied jobs (Candidate only)
- `GET /api/jobs/:id/applications` - Get job applications (Recruiter only)

### Resume
- `POST /api/resume/upload` - Upload resume (Candidate only)
- `GET /api/resume/download/:userId` - Download resume (Recruiter/Admin only)
- `GET /api/resume/preview` - Get resume preview

### Admin
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/jobs` - Get all jobs
- `DELETE /api/admin/jobs/:id` - Delete job
- `GET /api/admin/applications` - Get all applications
- `GET /api/admin/analytics` - Get analytics data

## Project Structure

```
job-portal/
├── backend/
│   ├── config/          # Database and multer configuration
│   ├── controllers/     # Route controllers
│   ├── database/        # SQL schema file
│   ├── middleware/      # Auth and error handling middleware
│   ├── routes/          # API routes
│   ├── services/        # Email service
│   ├── uploads/         # Resume uploads directory
│   └── utils/           # Utility functions
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # Reusable components
│       ├── config/      # API configuration
│       ├── pages/       # Page components
│       ├── services/    # API service functions
│       └── utils/       # Utility functions
└── README.md
```

## Key Features

- **Role-based Access Control**: Three user roles with different permissions
- **Job Search & Filtering**: Search jobs by title, company, or location
- **Resume Management**: PDF upload and download functionality
- **Application Tracking**: Candidates can track their applications
- **Analytics Dashboard**: Admin dashboard with statistics
- **Email Notifications**: Job application confirmations (simulated)
- **Responsive Design**: Modern UI with glassmorphism design
- **Indian Locale**: Salary in rupees (₹) and Indian cities support

## Author

Rishi Vykunta Arasavilli
