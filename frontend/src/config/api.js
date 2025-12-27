const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Log API URL in development to help with debugging
if (process.env.NODE_ENV === 'development') {
  console.log('🔗 API URL:', API_URL);
}

// Warn if using localhost in production (likely means env var is not set)
if (process.env.NODE_ENV === 'production' && API_URL.includes('localhost')) {
  console.error('❌ ERROR: API_URL is pointing to localhost in production!');
  console.error('⚠️  Make sure REACT_APP_API_URL is set in your production environment variables.');
  console.error('⚠️  Current API_URL:', API_URL);
}

export default API_URL;
