import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, ChevronLeft, ChevronRight, Play, Pause, 
  Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw
} from "lucide-react";
import { Photograph } from "../data";

interface LightboxProps {
  photos: Photograph[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ photos, currentIndex, onClose, onNavigate }: LightboxProps) {
  const activePhoto = photos[currentIndex];
  
  // Slideshow State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const slideDuration = 5000; // 5 seconds per slide
  const timerRef = useRef<number | null>(null);
  const progressRef = useRef<number | null>(null);

  // Zoom / Pan State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);


  const containerRef = useRef<HTMLDivElement>(null);

  // Close, Nav actions
  const triggerNext = () => {
    resetZoom();
    onNavigate((currentIndex + 1) % photos.length);
  };

  const triggerPrev = () => {
    resetZoom();
    onNavigate((currentIndex - 1 + photos.length) % photos.length);
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          triggerNext();
          break;
        case "ArrowLeft":
          triggerPrev();
          break;
        case " ":
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  // Slideshow Auto-Advance & Progress Bar Loop
  useEffect(() => {
    if (isPlaying) {
      setProgress(0);
      const startTime = Date.now();

      // Interval to update smooth progress bar
      progressRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min((elapsed / slideDuration) * 100, 100);
        setProgress(currentProgress);
      }, 50);

      // Timeout for advancing slide
      timerRef.current = window.setTimeout(() => {
        triggerNext();
      }, slideDuration);
    } else {
      setProgress(0);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isPlaying, currentIndex]);

  // Handle Fullscreen API
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Error enabling fullscreen mode:", err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);



  // Adjust zoom controller
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 1));

  // Draggable image pan handler
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset((prev) => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY
    }));
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <AnimatePresence>
      <div 
        ref={containerRef}
        id="lightbox-container"
        className="fixed inset-0 z-50 flex flex-col bg-[#020203]/99 backdrop-blur-2xl select-none"
      >
        {/* Playback Progress Indicator */}
        {isPlaying && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-850 z-[60]">
            <div 
              className="h-full bg-white transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Outer Frame Actions */}
        <div className="absolute top-6 left-6 z-50 flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            id="lightbox-play-btn"
            className="p-3 rounded-full bg-zinc-900/85 border border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all active:scale-95"
            title={isPlaying ? "Pause Slideshow" : "Start Slideshow"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button
            onClick={toggleFullscreen}
            id="lightbox-fullscreen-btn"
            className="p-3 rounded-full bg-zinc-900/85 border border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all active:scale-95 hidden sm:block"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>

        <button
          onClick={onClose}
          id="lightbox-close-btn"
          className="absolute top-6 right-6 z-50 p-3 rounded-full bg-zinc-900/85 border border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white transition-all active:scale-95"
          title="Close Portfolio (Esc)"
        >
          <X size={18} />
        </button>

        {/* FULL IMMERSIVE IMAGE VIEWPORT */}
        <div className="flex-1 w-full h-full relative flex items-center justify-center p-6 sm:p-12 md:p-16 group/interactive">
          
          {/* Navigation Arrows */}
          <button
            onClick={triggerPrev}
            id="lightbox-prev-btn"
            className="absolute left-6 z-40 p-4 rounded-full bg-zinc-950/80 border border-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all active:scale-95 opacity-0 group-hover/interactive:opacity-100 focus:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={triggerNext}
            id="lightbox-next-btn"
            className="absolute right-6 z-40 p-4 rounded-full bg-zinc-950/80 border border-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all active:scale-95 opacity-0 group-hover/interactive:opacity-100 focus:opacity-100"
          >
            <ChevronRight size={24} />
          </button>

          {/* Draggable Viewport */}
          <div 
            className={`w-full h-full flex items-center justify-center overflow-hidden relative ${zoomLevel > 1 ? "cursor-grab" : "cursor-default"}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
          >
            <motion.img
              key={activePhoto.id}
              src={activePhoto.url}
              alt={activePhoto.title}
              referrerPolicy="no-referrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: zoomLevel }}
              exit={{ opacity: 0, scale: 1.02 }}
              style={{
                x: panOffset.x,
                y: panOffset.y,
              }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="max-h-full max-w-full object-contain pointer-events-none rounded-md selection:bg-transparent shadow-2xl shadow-black/90"
            />
          </div>

          {/* Minimal Floating Caption */}
          <div className="absolute left-6 bottom-6 z-40 flex flex-col gap-1 text-white bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-lg border border-white/5">
            <span className="font-serif text-sm sm:text-base font-medium tracking-tight">
              {activePhoto.title}
            </span>
            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>{activePhoto.photographer}</span>
            </span>
          </div>

          {/* Float Zoom Quickbar */}
          <div className="absolute bottom-6 right-6 z-40 flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900/90 border border-zinc-800/80 shadow-md">
            <button 
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-1 px-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="font-mono text-xs text-zinc-400 w-12 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button 
              onClick={handleZoomIn}
              disabled={zoomLevel >= 4}
              className="p-1 px-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            {zoomLevel > 1 && (
              <button 
                onClick={resetZoom}
                className="p-1 px-2 text-rose-400 hover:text-rose-300 transition-colors border-l border-zinc-800 ml-1"
                title="Reset Zoom"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
