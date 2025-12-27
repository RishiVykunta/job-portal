const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'File too large. Maximum size is 5MB',
      },
    });
  }

  if (err.message === 'Only PDF files are allowed') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Only PDF files are allowed',
      },
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation error',
        details: Object.values(err.errors || {}).map((e) => e.message),
      },
    });
  }

  if (err.code === '23505') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Duplicate entry. This record already exists.',
      },
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid reference. Related record does not exist.',
      },
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
    },
  });
};

module.exports = errorHandler;
