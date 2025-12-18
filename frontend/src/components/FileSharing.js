import React, { useState, useEffect } from 'react';
import '../styles/FileSharing.css';
import { Upload, Trash2, Pencil, FileText, Download } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080';

function FileSharing() {
  const [files, setFiles] = useState([]);
  const [renamingFileId, setRenamingFileId] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/files/list`);
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch files');
      }
    } catch (error) {
      setError('Error fetching files. Please try again.');
      console.error('Error fetching files:', error);
    }
  };

  const uploadFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return;
    }

    setError('');
    setIsLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Uploading file:', file.name); // Debug log
      const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
        method: 'POST',
        body: formData,
        // Remove any default headers to let the browser set the correct Content-Type
      });

      const responseData = await response.json();
      console.log('Upload response:', responseData); // Debug log

      if (response.ok) {
        setUploadProgress(100);
        await fetchFiles();
      } else {
        setError(responseData.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error details:', error); // Debug log
      setError('Error uploading file. Please try again.');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const deleteFile = async (fileLocation) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/files/delete?file_location=${encodeURIComponent(fileLocation)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchFiles();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Delete failed');
      }
    } catch (error) {
      setError('Error deleting file. Please try again.');
      console.error('Error deleting file:', error);
    }
  };

  const startRenaming = (fileLocation, currentName) => {
    setRenamingFileId(fileLocation);
    setNewFileName(currentName);
  };

  const cancelRenaming = () => {
    setRenamingFileId(null);
    setNewFileName('');
  };

  const renameFile = async (fileLocation) => {
    if (!newFileName.trim()) {
      setError('File name cannot be empty');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file_location', fileLocation);
      formData.append('new_file_name', newFileName.trim());

      const response = await fetch(`${API_BASE_URL}/api/files/rename`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        cancelRenaming();
        await fetchFiles();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Rename failed');
      }
    } catch (error) {
      setError('Error renaming file. Please try again.');
      console.error('Error renaming file:', error);
    }
  };

  const downloadFile = async (fileLocation) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/files/download/${encodeURIComponent(fileLocation)}`);
      
      if (response.ok) {
        // Get the filename from the Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'downloaded-file';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }

        // Create a blob from the response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary link and trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Download failed');
      }
    } catch (error) {
      setError('Error downloading file. Please try again.');
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="file-sharing-wrapper">
      <header className="file-header">
        <h1>Document Hub</h1>
        <p>Upload, view, and manage your files in one place.</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="upload-section">
        <label className={`upload-btn ${isLoading ? 'uploading' : ''}`}>
          <Upload size={20} />
          {isLoading ? 'Uploading...' : 'Upload File'}
          <input 
            type="file" 
            hidden 
            onChange={uploadFile} 
            disabled={isLoading}
          />
        </label>
        {isLoading && (
          <div className="upload-progress">
            <div 
              className="progress-bar" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      <div className="file-list">
        {files.length === 0 && <p>No files uploaded yet.</p>}
        {files.map((file) => (
          <div className="file-card" key={file.id}>
            <FileText size={32} />
            <div className="file-info">
              {renamingFileId === file.fileLocation ? (
                <div className="rename-input">
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') renameFile(file.fileLocation);
                      if (e.key === 'Escape') cancelRenaming();
                    }}
                    autoFocus
                  />
                  <div className="rename-actions">
                    <button onClick={() => renameFile(file.fileLocation)}>Save</button>
                    <button onClick={cancelRenaming}>Cancel</button>
                  </div>
                </div>
              ) : (
                <h4 onClick={() => downloadFile(file.fileLocation)} style={{ cursor: 'pointer' }}>
                  {file.fileName}
                </h4>
              )}
            </div>
            <div className="file-actions">
              <button onClick={() => startRenaming(file.fileLocation, file.fileName)}>
                <Pencil size={16} />
              </button>
              <button onClick={() => deleteFile(file.fileLocation)}>
                <Trash2 size={16} />
              </button>
              <button onClick={() => downloadFile(file.fileLocation)}>
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileSharing;
