==> Job Portal Web Application

A full-stack Job Portal where candidates can search and apply for jobs, recruiters can post jobs, and admins can manage users, jobs, and applications — built with React, Node.js, Express, PostgreSQL, and JWT authentication.

==>Features

 Candidate

Register & login securely
Search jobs by title, company, or location
View job details (description, posted date)
Apply for jobs
Upload resume (PDF)
See Already Applied status

 Recruiter

Register & login
Post new jobs with description
View posted jobs

Admin

Admin dashboard
View all users
View all jobs
View all applications
Delete users or jobs

==> Tech Stack

**Frontend
React.js
CSS (Glassmorphism UI)
Fetch API
JWT (stored in localStorage)

**Backend
Node.js
Express.js
PostgreSQL
JWT Authentication
Multer (Resume upload)
Authentication & Roles
JWT token based authentication
Role-based access control

Project Structure:
job-portal/
│── .gitignore  
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── uploads/
│   ├── server.js
│
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── services/
│   ├── styles/
│   ├── App.js
│
└── README.md

==>For Running Locally

Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm start

“I built a full-stack Job Portal using React and Node.js with JWT authentication.
The system supports three roles: candidate, recruiter, and admin.
Candidates can search and apply for jobs and upload resumes, recruiters can post jobs, and admins manage everything via a dashboard.
I implemented role-based access control, protected routes, file uploads, and PostgreSQL relationships.”

==>Future Enhancements

Pagination for jobs
Email notifications
Resume preview
Admin analytics dashboard
React Router navigation

==>Author
Rishi Vykunta Arasavilli
Full Stack Developer
