'use client';

import React from 'react';
import { Bed, Bath, Maximize, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  name: string;
  status: string;
  description: string;
  price?: string;
  location?: string;
  beds?: string;
  baths?: string;
  sqft?: string;
  image?: string;
  bedImages?: string[];
  bathImages?: string[];
}

interface ProjectGridProps {
  title: string;
  projects: Project[];
  primaryColor?: string;
  theme?: 'light' | 'dark';
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ 
  title = "Featured Listings", 
  projects = [],
  primaryColor = "#8b5cf6",
  theme = 'dark'
}) => {
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);

  return (
    <section id="listings" className="py-32 bg-[#0b1120] text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black mb-6 tracking-tight"
          >
            {title}
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-slate-400 text-lg max-w-2xl mx-auto font-light"
          >
            Handpicked premium properties available now
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-[#0f172a] rounded-[32px] border border-white/5 overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={project.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"} 
                  alt={project.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
                
                {/* Price Tag */}
                <div className="absolute top-6 right-6">
                  <div className="bg-[#8b5cf6] text-zinc-950 px-4 py-1.5 rounded-lg font-bold text-sm shadow-lg">
                    {project.price || "$2,500,000"}
                  </div>
                </div>

                {/* Status Badge */}
                 <div className="absolute top-6 left-6">
                  <div className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md ${
                    project.status === 'Sold' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    project.status === 'For Sale' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    project.status === 'Developing' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                    'bg-white/10 text-white border-white/10'
                  }`}>
                    {project.status || "Ready"}
                  </div>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#8b5cf6] transition-colors">
                  {project.name}
                </h3>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                  <MapPin className="w-4 h-4 text-[#8b5cf6]" />
                  {project.location || "Miami Beach, FL"}
                </div>

                <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/5 mb-8">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-[#8b5cf6]" />
                    <span className="text-xs font-semibold">{project.beds || "5"} Beds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-4 h-4 text-[#8b5cf6]" />
                    <span className="text-xs font-semibold">{project.baths || "4"} Baths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize className="w-4 h-4 text-[#8b5cf6]" />
                    <span className="text-xs font-semibold">{project.sqft || "6,500"} sqft</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedProject(project)}
                  className="w-full py-4 bg-[#8b5cf6] text-zinc-950 font-bold rounded-xl hover:bg-[#7c3aed] transition-all mt-auto"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full text-center py-12 text-zinc-400 italic">
              No listings added yet.
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0f172a] rounded-[40px] border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Left Side: Photo Gallery */}
              <div className="w-full md:w-1/2 h-[300px] md:h-auto overflow-y-auto custom-scrollbar bg-black/20 p-6 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Main View</span>
                  <div className="aspect-video rounded-3xl overflow-hidden border border-white/5">
                    <img 
                      src={selectedProject.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"} 
                      className="w-full h-full object-cover" 
                      alt="Main"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {selectedProject.bedImages?.map((img, i) => (
                    <div key={`bed-${i}`} className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Bedroom View {selectedProject.bedImages!.length > 1 ? i + 1 : ''}</span>
                      <div className="aspect-video rounded-3xl overflow-hidden border border-white/5">
                        <img src={img} className="w-full h-full object-cover" alt={`Bedroom ${i + 1}`} />
                      </div>
                    </div>
                  ))}
                  {selectedProject.bathImages?.map((img, i) => (
                    <div key={`bath-${i}`} className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Bathroom View {selectedProject.bathImages!.length > 1 ? i + 1 : ''}</span>
                      <div className="aspect-video rounded-3xl overflow-hidden border border-white/5">
                        <img src={img} className="w-full h-full object-cover" alt={`Bathroom ${i + 1}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Details */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
                <div className="mb-8">
                  <div className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border mb-6 ${
                    selectedProject.status === 'Sold' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    selectedProject.status === 'Developed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {selectedProject.status || "Ready"}
                  </div>
                  <h2 className="text-4xl font-black text-white mb-4 leading-tight">
                    {selectedProject.name}
                  </h2>
                  <div className="flex items-center gap-2 text-slate-400 text-lg">
                    <MapPin className="w-5 h-5 text-[#8b5cf6]" />
                    {selectedProject.location || "Miami Beach, FL"}
                  </div>
                </div>

                <div className="text-3xl font-bold text-[#8b5cf6] mb-10">
                  {selectedProject.price || "$2,500,000"}
                </div>

                <div className="grid grid-cols-3 gap-6 py-8 border-y border-white/5 mb-10">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Bed className="w-5 h-5 text-[#8b5cf6]" />
                      <span className="text-xs font-bold uppercase tracking-wider">Beds</span>
                    </div>
                    <span className="text-xl font-bold text-white">{selectedProject.beds || "5"}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Bath className="w-5 h-5 text-[#8b5cf6]" />
                      <span className="text-xs font-bold uppercase tracking-wider">Baths</span>
                    </div>
                    <span className="text-xl font-bold text-white">{selectedProject.baths || "4"}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Maximize className="w-5 h-5 text-[#8b5cf6]" />
                      <span className="text-xs font-bold uppercase tracking-wider">Area</span>
                    </div>
                    <span className="text-xl font-bold text-white">{selectedProject.sqft || "6,500"} <span className="text-xs text-slate-500">sqft</span></span>
                  </div>
                </div>

                <div className="space-y-4 mb-12">
                   <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Description</h4>
                   <p className="text-slate-300 leading-relaxed">
                     {selectedProject.description || "Experience unparalleled luxury in this stunning architectural masterpiece. Featuring floor-to-ceiling windows, premium finishes, and breathtaking views, this property redefines modern living."}
                   </p>
                </div>

                <button 
                  onClick={() => {
                    setSelectedProject(null);
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-5 bg-[#8b5cf6] text-zinc-950 font-black rounded-2xl hover:bg-[#7c3aed] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-purple-500/20"
                >
                  Inquire Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

