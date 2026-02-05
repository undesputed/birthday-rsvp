'use client';

import Image from 'next/image';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const galleryImages = [
  { id: 1, src: '/LDM00001%20(1).jpg', alt: 'Gallery photo 1' },
  { id: 2, src: '/LDM00001.jpg', alt: 'Gallery photo 2' },
  { id: 3, src: '/LDM00020.jpg', alt: 'Gallery photo 3' },
  { id: 4, src: '/LDM00024.jpg', alt: 'Gallery photo 4' },
  { id: 5, src: '/LDM00106.jpg', alt: 'Gallery photo 5' },
  { id: 6, src: '/LDM00117.jpg', alt: 'Gallery photo 6' },
  { id: 7, src: '/LDM00129.jpg', alt: 'Gallery photo 7' },
  { id: 8, src: '/LDM00140.jpg', alt: 'Gallery photo 8' },
  { id: 9, src: '/LDM00155.jpg', alt: 'Gallery photo 9' },
];

export function PhotoGallery() {
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

  const currentIndex = selectedImageId
    ? galleryImages.findIndex((img) => img.id === selectedImageId)
    : -1;

  const goToNextImage = () => {
    if (currentIndex < galleryImages.length - 1) {
      setSelectedImageId(galleryImages[currentIndex + 1].id);
    }
  };

  const goToPreviousImage = () => {
    if (currentIndex > 0) {
      setSelectedImageId(galleryImages[currentIndex - 1].id);
    }
  };

  const selectedImage = galleryImages.find((img) => img.id === selectedImageId);

  return (
    <section id="gallery" className="w-full py-12 sm:py-16 px-3 sm:px-4 bg-gradient-to-br from-secondary/30 via-background to-primary/5 relative">
      {/* Decorative elements - hidden on small screens */}
      <div className="hidden sm:block absolute top-5 left-5 text-4xl sm:text-5xl opacity-15">🎈</div>
      <div className="hidden sm:block absolute bottom-5 right-5 text-4xl sm:text-5xl opacity-15">🎉</div>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center text-foreground mb-2">
          Gallery
        </h2>
        <p className="text-center text-foreground/70 mb-8 sm:mb-12 text-sm sm:text-lg">
          Click on any image to view it in fullscreen
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
          {galleryImages.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageId(image.id)}
              className="relative aspect-square overflow-hidden rounded-lg sm:rounded-2xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-sm:border-2 border-primary/20 hover:border-primary/50"
            >
              <Image
                src={image.src || '/placeholder.svg'}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </button>
          ))}
        </div>

        {/* Fullscreen Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-2 sm:p-4"
            onClick={() => setSelectedImageId(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImageId(null)}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 sm:p-2 transition-colors"
              aria-label="Close fullscreen"
            >
              <X className="w-5 sm:w-6 h-5 sm:h-6" />
            </button>

            {/* Main Image */}
            <div
              className="relative w-full max-w-4xl h-full max-h-screen flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src || '/placeholder.svg'}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                className="w-full h-full object-contain"
                priority
              />

              {/* Navigation Buttons */}
              {currentIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPreviousImage();
                  }}
                  className="absolute left-1 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 sm:p-3 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 sm:w-8 h-5 sm:h-8" />
                </button>
              )}

              {currentIndex < galleryImages.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextImage();
                  }}
                  className="absolute right-1 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 sm:p-3 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 sm:w-8 h-5 sm:h-8" />
                </button>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                {currentIndex + 1} / {galleryImages.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
