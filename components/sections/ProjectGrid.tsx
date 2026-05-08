'use client';

import React from 'react';
import { Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

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
  return (
    <section className="py-32 bg-[#0b1120] text-white overflow-hidden">
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
                    project.status === 'Developed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
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

                <button className="w-full py-4 bg-[#8b5cf6] text-zinc-950 font-bold rounded-xl hover:bg-[#7c3aed] transition-all mt-auto">
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
    </section>
  );
};

