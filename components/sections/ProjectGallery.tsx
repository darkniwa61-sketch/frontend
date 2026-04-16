import React from 'react';

interface ProjectGalleryProps {
  title: string;
  images: string[];
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ title, images }) => {
  return (
    <section className="py-24 px-6 flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-zinc-900">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl w-full">
        {images.map((image, i) => (
          <div key={i} className="aspect-square relative overflow-hidden group rounded-xl bg-zinc-200">
            <img 
              src={image} 
              alt={`Project ${i}`} 
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <span className="text-white font-semibold flex items-center gap-2">
                View Project 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
