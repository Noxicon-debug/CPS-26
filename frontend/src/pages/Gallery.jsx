import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Grid, LayoutGrid } from 'lucide-react';
import { Button } from '../components/ui/button';

// Generate list of all images
const generateImageList = () => {
  const images = [];
  const imageNames = [
    'AG8A2573', 'AG8A2576-2', 'AG8A2576', 'AG8A2578', 'AG8A2579-2', 'AG8A2580', 'AG8A2581',
    'AG8A2584', 'AG8A2586', 'AG8A2588', 'AG8A2590', 'AG8A2591', 'AG8A2592', 'AG8A2593',
    'AG8A2595', 'AG8A2597', 'AG8A2598', 'AG8A2599', 'AG8A2601', 'AG8A2602', 'AG8A2604',
    'AG8A2605', 'AG8A2607', 'AG8A2610', 'AG8A2614', 'AG8A2615', 'AG8A2616', 'AG8A2617',
    'AG8A2618', 'AG8A2619', 'AG8A2620', 'AG8A2621', 'AG8A2622', 'AG8A2623', 'AG8A2624',
    'AG8A2625', 'AG8A2626', 'AG8A2627', 'AG8A2628', 'AG8A2629', 'AG8A2632', 'AG8A2633',
    'AG8A2634', 'AG8A2635', 'AG8A2637', 'AG8A2638', 'AG8A2639'
  ];
  
  imageNames.forEach((name) => {
    images.push(`/images/Highlights/${name}.jpg`);
  });
  
  return images;
};

export const Gallery = () => {
  const [images] = useState(generateImageList());
  const [selectedImage, setSelectedImage] = useState(null);
  const [visibleCount, setVisibleCount] = useState(24);
  const [layout, setLayout] = useState('masonry'); // 'masonry' or 'grid'

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 12, images.length));
  };

  const openLightbox = (index) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction) => {
    if (selectedImage === null) return;
    const newIndex = selectedImage + direction;
    if (newIndex >= 0 && newIndex < images.length) {
      setSelectedImage(newIndex);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImage === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateImage(-1);
      if (e.key === 'ArrowRight') navigateImage(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <div data-testid="gallery-page" className="pt-20">
      {/* Header */}
      <section className="py-16 md:py-24 bg-[#EAE5DC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
              Photo Gallery
            </span>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl tracking-tighter font-medium text-[#1C2522] leading-tight mt-4">
              Community Highlights
            </h1>
            <p className="text-lg text-[#4A5D54] mt-4 max-w-2xl mx-auto">
              Capturing moments of faith, fellowship, and service from our community events.
            </p>
          </motion.div>

          {/* Layout Toggle */}
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant={layout === 'masonry' ? 'default' : 'outline'}
              onClick={() => setLayout('masonry')}
              data-testid="layout-masonry"
              className={`rounded-sm ${layout === 'masonry' ? 'bg-[#1C2522] text-[#F8F5F0]' : 'border-[#1C2522]/20'}`}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Masonry
            </Button>
            <Button
              variant={layout === 'grid' ? 'default' : 'outline'}
              onClick={() => setLayout('grid')}
              data-testid="layout-grid"
              className={`rounded-sm ${layout === 'grid' ? 'bg-[#1C2522] text-[#F8F5F0]' : 'border-[#1C2522]/20'}`}
            >
              <Grid className="w-4 h-4 mr-2" />
              Grid
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {layout === 'masonry' ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {images.slice(0, visibleCount).map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (idx % 12) * 0.05 }}
                  viewport={{ once: true, margin: '-50px' }}
                  className="break-inside-avoid mb-4 cursor-pointer group"
                  onClick={() => openLightbox(idx)}
                >
                  <div className="relative overflow-hidden rounded-sm">
                    <img
                      src={img}
                      alt={`Gallery image ${idx + 1}`}
                      data-testid={`gallery-image-${idx}`}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#1C2522]/0 group-hover:bg-[#1C2522]/20 transition-colors duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.slice(0, visibleCount).map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: (idx % 12) * 0.05 }}
                  viewport={{ once: true, margin: '-50px' }}
                  className="cursor-pointer group aspect-square"
                  onClick={() => openLightbox(idx)}
                >
                  <div className="relative overflow-hidden rounded-sm h-full">
                    <img
                      src={img}
                      alt={`Gallery image ${idx + 1}`}
                      data-testid={`gallery-grid-image-${idx}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#1C2522]/0 group-hover:bg-[#1C2522]/20 transition-colors duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Load More */}
          {visibleCount < images.length && (
            <div className="text-center mt-12">
              <Button
                onClick={loadMore}
                data-testid="load-more-button"
                className="bg-[#1C2522] text-[#F8F5F0] hover:bg-[#2D3B36] px-8 rounded-sm"
              >
                Load More ({images.length - visibleCount} remaining)
              </Button>
            </div>
          )}

          <p className="text-center text-[#4A5D54] mt-8 text-sm">
            Showing {Math.min(visibleCount, images.length)} of {images.length} photos
          </p>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1C2522]/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
            data-testid="lightbox"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 text-[#F8F5F0] hover:text-[#C29B57] transition-colors z-50"
              data-testid="lightbox-close"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}
              className={`absolute left-4 p-3 rounded-full bg-[#F8F5F0]/10 text-[#F8F5F0] hover:bg-[#F8F5F0]/20 transition-colors ${
                selectedImage === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={selectedImage === 0}
              data-testid="lightbox-prev"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigateImage(1); }}
              className={`absolute right-4 p-3 rounded-full bg-[#F8F5F0]/10 text-[#F8F5F0] hover:bg-[#F8F5F0]/20 transition-colors ${
                selectedImage === images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={selectedImage === images.length - 1}
              data-testid="lightbox-next"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Image */}
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={images[selectedImage]}
              alt={`Gallery image ${selectedImage + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-sm"
              onClick={(e) => e.stopPropagation()}
              data-testid="lightbox-image"
            />

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#F8F5F0]/70 text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
