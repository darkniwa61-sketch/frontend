'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';

interface ProjectGalleryProps {
  title: string;
  images: string[];
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ title, images }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="py-24 px-6 flex flex-col items-center bg-white">
      <h2 className="text-4xl md:text-5xl font-black mb-16 text-zinc-900 tracking-tighter">
        {title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
        {images.map((image, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5 }}
            className="aspect-square relative overflow-hidden group rounded-3xl bg-zinc-100 cursor-pointer shadow-sm hover:shadow-xl transition-shadow"
            onClick={() => setSelectedImage(image)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={image} 
              alt={`Project ${i}`} 
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-white font-bold flex items-center gap-2 text-sm uppercase tracking-widest bg-zinc-900/50 px-6 py-3 rounded-full border border-white/20">
                View Project 
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-20 bg-zinc-950/90 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white hover:text-zinc-400 transition-colors bg-zinc-900/50 p-3 rounded-full border border-white/10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={selectedImage} 
                alt="Selected Project" 
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/5"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
