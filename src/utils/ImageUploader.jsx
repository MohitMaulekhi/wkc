import React, { useState, useEffect } from 'react';

const ImageUploader = ({ 
  onImageUpload, 
  buttonText = "Upload Image", 
  allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  maxFileSize = 10485760, // 10MB in bytes
  showPreview = true,
  className = "",
  style = {}
}) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cloudinaryLoaded, setCloudinaryLoaded] = useState(false);

  // Check if Cloudinary is loaded
  useEffect(() => {
    const checkCloudinary = () => {
      if (window.cloudinary) {
        setCloudinaryLoaded(true);
      } else {
        console.error('Cloudinary widget not loaded. Make sure to include the Cloudinary script in your HTML.');
      }
    };

    // Check immediately
    checkCloudinary();

    // Also check after a short delay in case script is still loading
    const timer = setTimeout(checkCloudinary, 1000);

    return () => clearTimeout(timer);
  }, []);

  const openCloudinaryWidget = () => {
    if (!window.cloudinary) {
      alert('Cloudinary widget is not loaded. Please check your setup.');
      return;
    }

    setIsUploading(true);
    
    try {
      window.cloudinary.openUploadWidget(
        {
          cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          max_files: 1,
          client_allowed_formats: allowedFormats,
          max_file_size: maxFileSize,
          sources: ['local', 'url', 'camera'],
          show_powered_by: false,
          theme: 'minimal'
        },
        (error, result) => {
          setIsUploading(false);
          
          if (error) {
            console.error('Upload error:', error);
            alert('Upload failed. Please try again.');
            return;
          }

          if (result && result.event === 'success') {
            const imageData = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
              originalFilename: result.info.original_filename || 'Unknown',
              format: result.info.format,
              width: result.info.width,
              height: result.info.height,
              bytes: result.info.bytes,
              createdAt: result.info.created_at
            };

            console.log('Image uploaded successfully:', imageData);
            
            setUploadedImage(imageData);
            
            // Send image data to parent widget
            if (onImageUpload) {
              onImageUpload(imageData);
            }
          }
        }
      );
    } catch (error) {
      console.error('Error opening Cloudinary widget:', error);
      setIsUploading(false);
      alert('Failed to open upload widget. Please try again.');
    }
  };

  return (
    <div 
      className={`image-uploader ${className}`} 
      style={{
        // Remove flex centering that might affect layout
        position: 'relative',
        display: 'inline-block',
        width: 'auto',
        maxWidth: '100%',
        ...style
      }}
    >
      {/* Only show button if no image is uploaded */}
      {!uploadedImage && (
        <button 
          onClick={openCloudinaryWidget} 
          disabled={isUploading || !cloudinaryLoaded}
          style={{
            padding: '12px 24px',
            backgroundColor: isUploading || !cloudinaryLoaded ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isUploading || !cloudinaryLoaded ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'inline-block',
            ...style.button
          }}
        >
          {isUploading ? 'Uploading...' : !cloudinaryLoaded ? 'Loading...' : buttonText}
        </button>
      )}

      {/* Show loading message if Cloudinary not loaded */}
      {!cloudinaryLoaded && !uploadedImage && (
        <p style={{ 
          color: '#666', 
          fontSize: '12px', 
          margin: '5px 0 0 0',
          display: 'inline-block'
        }}>
          Loading upload widget...
        </p>
      )}

      {/* Image preview - contained within component */}
      {showPreview && uploadedImage && (
        <div style={{ 
          marginTop: '15px',
          width: '100%',
          maxWidth: '300px'
        }}>
          <h4 style={{ 
            margin: '0 0 10px 0', 
            color: '#333',
            fontSize: '14px'
          }}>
            Uploaded Image
          </h4>
          <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '10px',
            backgroundColor: '#f9f9f9',
            width: '100%'
          }}>
            <img 
              src={uploadedImage.url} 
              alt={uploadedImage.originalFilename}
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '6px',
                display: 'block'
              }}
            />
            <div style={{ 
              fontSize: '11px', 
              color: '#666', 
              marginTop: '8px',
              lineHeight: '1.3'
            }}>
              <div><strong>File:</strong> {uploadedImage.originalFilename}</div>
              <div><strong>Size:</strong> {(uploadedImage.bytes / 1024 / 1024).toFixed(2)} MB</div>
              <div><strong>Dimensions:</strong> {uploadedImage.width} × {uploadedImage.height}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;