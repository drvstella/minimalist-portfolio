import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Photograph } from "../data";
import PhotoCard from "./PhotoCard";

interface PortfolioGridProps {
  photos: Photograph[];
  layoutMode: "bento" | "grid" | "list";
  onSelectPhoto: (index: number) => void;
}

export default function PortfolioGrid({
  photos,
  layoutMode,
  onSelectPhoto
}: PortfolioGridProps) {
  // Return appropriate CSS grid container styles
  const gridContainerStyles = {
    bento: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-dense gap-5 auto-rows-[240px] sm:auto-rows-[220px] md:auto-rows-[250px]",
    grid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
    list: "max-w-2xl mx-auto flex flex-col gap-12 sm:gap-16"
  }[layoutMode];

  return (
    <section id="portfolio-grid-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-24 md:pb-36 min-h-[500px]">
      <AnimatePresence mode="popLayout">
        {photos.length > 0 ? (
          <motion.div
            key={layoutMode}
            initial="hidden"
            animate="show"
            exit="hidden"
            className={gridContainerStyles}
          >
            {photos.map((photo, index) => {
              return (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={index}
                  layoutMode={layoutMode}
                  onSelect={() => onSelectPhoto(index)}
                />
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <p className="font-mono text-sm text-zinc-500 uppercase tracking-widest">
              No archives matched this selection.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
