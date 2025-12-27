import React, { useState } from 'react';
import { uploadResume } from '../services/resumeService';
import Button from './Button';
import Alert from './Alert';
import './ResumeUpload.css';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setError('');
      setSuccess('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await uploadResume(file);
      setSuccess('Resume uploaded successfully!');
      setFile(null);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setError(err.message || 'Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-upload">
      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      <div className="upload-container">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={loading}
          className="file-input"
        />
        {file && (
          <div className="file-info">
            <span>Selected: {file.name}</span>
          </div>
        )}
        <Button onClick={handleUpload} disabled={!file || loading}>
          {loading ? 'Uploading...' : 'Upload Resume'}
        </Button>
      </div>
    </div>
  );
};

export default ResumeUpload;

