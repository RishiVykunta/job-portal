const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateRegister = (name, email, password, role) => {
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!email || !validateEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!validatePassword(password)) {
    errors.push('Password must be at least 6 characters');
  }

  if (!role || !['candidate', 'recruiter'].includes(role)) {
    errors.push('Role must be either candidate or recruiter');
  }

  return errors;
};

const validateLogin = (email, password) => {
  const errors = [];

  if (!email || !validateEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  return errors;
};

const validateJob = (title, company, location, description) => {
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (!company || company.trim().length < 2) {
    errors.push('Company name must be at least 2 characters');
  }

  if (!location || location.trim().length < 2) {
    errors.push('Location must be at least 2 characters');
  }

  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  return errors;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRegister,
  validateLogin,
  validateJob,
};
