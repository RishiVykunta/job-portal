const ROLES = {
  CANDIDATE: 'candidate',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',
};

const JWT_EXPIRES_IN = '7d';
const JOBS_PER_PAGE = 10;

module.exports = {
  ROLES,
  JWT_EXPIRES_IN,
  JOBS_PER_PAGE,
};
