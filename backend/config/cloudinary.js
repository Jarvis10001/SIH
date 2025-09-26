const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'college-erp/admissions', // Folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    resource_type: 'auto', // Automatically detect file type
    public_id: (req, file) => {
      // Generate unique filename
      const userId = req.user?.id || 'unknown';
      const timestamp = Date.now();
      const fieldName = file.fieldname;
      return `${userId}_${fieldName}_${timestamp}`;
    },
    transformation: [
      // Optimize images
      { 
        width: 1200, 
        height: 1200, 
        crop: 'limit',
        quality: 'auto',
        fetch_format: 'auto' 
      }
    ]
  },
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedTypes = {
    'image/jpeg': true,
    'image/jpg': true,
    'image/png': true,
    'application/pdf': true,
    'application/msword': true,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true
  };

  // Define max file sizes (in bytes)
  const maxSizes = {
    'image/jpeg': 5 * 1024 * 1024, // 5MB for images
    'image/jpg': 5 * 1024 * 1024,
    'image/png': 5 * 1024 * 1024,
    'application/pdf': 10 * 1024 * 1024, // 10MB for PDFs
    'application/msword': 10 * 1024 * 1024,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 10 * 1024 * 1024
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: JPG, PNG, PDF, DOC, DOCX`), false);
  }
};

// Helper function to delete files from Cloudinary
const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
};

// Helper function to get optimized URL
const getOptimizedUrl = (publicId, options = {}) => {
  const defaultOptions = {
    quality: 'auto',
    fetch_format: 'auto',
    ...options
  };
  
  return cloudinary.url(publicId, defaultOptions);
};

// Helper function to get file info
const getFileInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('Error getting file info from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  storage,
  fileFilter,
  deleteFile,
  getOptimizedUrl,
  getFileInfo
};