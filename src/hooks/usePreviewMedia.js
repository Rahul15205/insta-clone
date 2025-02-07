import { useState } from 'react';
import useShowToast from './useShowToast';

const usePreviewMedia = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaType, setMediaType] = useState(null); // Track media type
  const showToast = useShowToast();
  const maxFileSizeInBytes = 2 * 1024 * 1024*1024; // 2MB

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      
      if (file.size > maxFileSizeInBytes) {
        showToast("Error", "File size must be less than 2MB", "error");
        setSelectedFile(null);
        setMediaType(null);
        return;
      }
      
      if (isImage || isVideo) {
        setMediaType(isImage ? 'image' : 'video');
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedFile(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        showToast("Error", "Please select an image or video file", "error");
        setSelectedFile(null);
        setMediaType(null);
      }
    }
  };

  return { selectedFile, handleMediaChange, setSelectedFile, mediaType };
};

export default usePreviewMedia;
