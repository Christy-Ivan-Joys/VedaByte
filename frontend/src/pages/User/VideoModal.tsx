import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { VideoModalProps } from '../../types';
const VideoModal:React.FC<VideoModalProps> = ({ isOpen, videoUrl, onClose }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-zinc-900 rounded-lg shadow-lg p-6 relative w-full max-w-3xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          <FaTimes size={24} />
        </button>
        <video className="w-full h-auto rounded-lg" controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoModal;
