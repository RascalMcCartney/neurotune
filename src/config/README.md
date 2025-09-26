# Storage Configuration

This directory contains configuration files for the neurotune application.

## Storage Providers

The application supports two storage providers:

### 1. Azure Blob Storage
- **Best for**: Production deployments, scalable storage
- **Pros**: Highly scalable, built-in CDN, enterprise features
- **Cons**: Requires Azure account, potential CORS issues

### 2. Filesystem Storage
- **Best for**: Local development, testing, simple deployments
- **Pros**: No external dependencies, no CORS issues, simple setup
- **Cons**: Not scalable, files stored on server disk

## Switching Storage Providers

To switch between storage providers, update the environment variable:

```bash
# Use Azure Blob Storage
VITE_STORAGE_PROVIDER=azure

# Use Filesystem Storage  
VITE_STORAGE_PROVIDER=filesystem
```

### Azure Configuration
```bash
VITE_AZURE_STORAGE_ACCOUNT=your_storage_account
VITE_AZURE_CONTAINER_NAME=your_container
VITE_AZURE_SAS_TOKEN=your_sas_token
```

### Filesystem Configuration
```bash
VITE_FILESYSTEM_UPLOAD_PATH=/uploads
VITE_FILESYSTEM_BASE_URL=http://localhost:5173
```

## Backend API Requirements

When using filesystem storage, you'll need to implement these API endpoints:

### Upload Endpoint
```
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: The audio file
- fileName: Generated unique filename  
- originalName: Original filename

Response:
{
  "success": boolean,
  "fileName"?: string,
  "error"?: string
}
```

### Delete Endpoint
```
DELETE /api/upload/:fileName

Response:
{
  "success": boolean,
  "error"?: string
}
```

### File Serving
Files should be served from the configured upload path and accessible via HTTP.

## Example Backend Implementation (Node.js/Express)

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, req.body.fileName);
  }
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.json({ success: false, error: 'No file uploaded' });
  }
  
  res.json({ 
    success: true, 
    fileName: req.file.filename 
  });
});

app.delete('/api/upload/:fileName', (req, res) => {
  const filePath = path.join('./uploads/', req.params.fileName);
  
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.json({ success: false, error: err.message });
    }
    res.json({ success: true });
  });
});

// Serve files
app.use('/uploads', express.static('uploads'));
```