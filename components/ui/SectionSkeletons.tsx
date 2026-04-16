import React from 'react';

export const HeroSkeleton = () => {
  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-900">
      <div className="absolute inset-0 z-0 bg-zinc-800 animate-shimmer" />
      <div className="absolute inset-0 z-10 To: bg-linear-to-t from-zinc-950 via-zinc-900/60 to-transparent" />
      
      <div className="relative z-20 text-center max-w-5xl px-6 w-full flex flex-col items-center">
        {/* Title Skeleton */}
        <div className="h-20 md:h-32 w-3/4 bg-zinc-700/50 rounded-2xl mb-8 animate-shimmer" />
        {/* Subtitle Skeleton */}
        <div className="h-6 md:h-10 w-1/2 bg-zinc-700/50 rounded-xl mb-6 animate-shimmer" />
        {/* Line Skeleton */}
        <div className="mt-12 h-1.5 w-32 bg-zinc-700/50 rounded-full animate-shimmer" />
      </div>
    </section>
  );
};

export const FeatureGridSkeleton = () => {
  return (
    <section className="py-28 bg-white flex flex-col items-center px-6">
      <div className="text-center mb-20 w-full flex flex-col items-center">
        <div className="h-16 w-1/3 bg-zinc-100 rounded-2xl animate-shimmer" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl w-full">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="bg-zinc-50 p-12 rounded-4xl border border-zinc-100"
          >
            {/* Icon Skeleton */}
            <div className="w-16 h-16 bg-zinc-200/50 rounded-2xl mb-8 animate-shimmer" />
            {/* Title Skeleton */}
            <div className="h-8 w-2/3 bg-zinc-200/50 rounded-lg mb-6 animate-shimmer" />
            {/* Description Skeleton */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-zinc-200/50 rounded-md animate-shimmer" />
              <div className="h-4 w-5/6 bg-zinc-200/50 rounded-md animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const LandingPageSkeleton = () => {
  return (
    <main className="min-h-screen">
      <HeroSkeleton />
      <FeatureGridSkeleton />
    </main>
  );
};
