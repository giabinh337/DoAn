import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGalleryModal = ({ isOpen, onClose, images, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
      // Focus modal for keyboard navigation
      setTimeout(() => {
        if (modalRef.current) modalRef.current.focus();
      }, 0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex]);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-[100] bg-black/70 flex flex-col focus:outline-none backdrop-blur-md"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 md:p-6 text-white shrink-0 absolute top-0 left-0 right-0 z-10">
        <div className="text-sm font-medium bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-lg">
          {currentIndex + 1} / {images.length}
        </div>
        <button 
          onClick={onClose}
          className="p-2.5 hover:bg-white/10 rounded-full transition-colors bg-black/20 backdrop-blur-sm border border-white/10"
        >
          <X className="w-7 h-7" />
        </button>
      </div>

      {/* Main Image Area */}
      <div 
        className="flex-1 relative flex items-center justify-center p-4 overflow-hidden pt-24 pb-4"
        onClick={onClose} // Clicking outside image closes modal
      >
        <button 
          onClick={(e) => { e.stopPropagation(); prevImage(); }}
          className="absolute left-4 md:left-10 p-3 md:p-4 rounded-full bg-black/40 hover:bg-white/20 text-white transition-all backdrop-blur-md border border-white/10 hover:scale-110 z-10"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        
        <img 
          src={images[currentIndex]} 
          alt={`Gallery ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain select-none shadow-2xl rounded-sm"
          onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking on image
          onError={(e) => { e.target.src = images[0]; }}
        />

        <button 
          onClick={(e) => { e.stopPropagation(); nextImage(); }}
          className="absolute right-4 md:right-10 p-3 md:p-4 rounded-full bg-black/40 hover:bg-white/20 text-white transition-all backdrop-blur-md border border-white/10 hover:scale-110 z-10"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="h-32 shrink-0 bg-black/60 backdrop-blur-md p-4 flex gap-3 overflow-x-auto justify-center items-center no-scrollbar border-t border-white/10">
        {images.map((img, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative h-20 w-28 md:h-24 md:w-36 shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${
              idx === currentIndex 
                ? 'border-2 border-white ring-4 ring-white/20 opacity-100 scale-105' 
                : 'opacity-40 hover:opacity-80 border border-transparent'
            }`}
          >
            <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.src = images[0]; }} />
            <div className={`absolute inset-0 bg-black/20 transition-opacity ${idx === currentIndex ? 'opacity-0' : 'opacity-100'}`}></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGalleryModal;
