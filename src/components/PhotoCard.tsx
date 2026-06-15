import React, { useState } from "react";
import { motion } from "motion/react";
import { Photograph } from "../data";

interface PhotoCardProps {
  key?: string;
  photo: Photograph;
  onSelect: () => void;
  index: number;
  layoutMode: "bento" | "grid" | "list";
}

export default function PhotoCard({ photo, onSelect, index, layoutMode }: PhotoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine width based on spans for visual consistency
  const gridClasses = {
    bento: `${photo.colSpan === "col-span-2" ? "col-span-1 sm:col-span-2" : "col-span-1"} ${photo.rowSpan === "row-span-2" ? "row-span-1 sm:row-span-2" : "row-span-1"}`,
    grid: "col-span-1 row-span-1",
    list: "col-span-full"
  }[layoutMode];

  // Motion variants for stagger entrances
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15,
        delay: index * 0.04
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      whileHover={{ y: -6 }}
      onClick={onSelect}
      id={`photo-card-${photo.id}`}
      className={`group relative overflow-hidden rounded-xl bg-zinc-900 cursor-zoom-in ${gridClasses} ${
        layoutMode === "bento" ? "w-full h-full min-h-[240px] sm:min-h-0" : ""
      } ${
        layoutMode === "grid" ? "w-full aspect-[4/3]" : ""
      } ${
        layoutMode === "list" ? "w-full aspect-[4/3] sm:aspect-[16/9] max-w-3xl mx-auto" : ""
      } transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/60`}
    >
      {/* Loading Shimmer */}
      {!isLoaded && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center animate-pulse overflow-hidden bg-zinc-800"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
      )}

      {/* High-Resolution Main Image */}
      <img
        src={photo.url}
        alt={photo.title}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Elegant Dark Subtle Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Frame border highlight */}
      <div className="absolute inset-0 border border-white/5 group-hover:border-white/10 rounded-xl pointer-events-none transition-colors duration-300" />

      {/* Hover Info HUD */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase mb-1">
          {photo.category}
        </span>
        <h3 className="font-serif text-lg sm:text-xl font-medium tracking-tight mb-2 flex items-center gap-1.5">
          {photo.title}
        </h3>


      </div>
    </motion.div>
  );
}
