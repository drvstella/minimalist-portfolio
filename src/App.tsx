import { useState, useEffect, useCallback } from "react";
import { Photograph } from "./data";
import { supabase } from "./lib/supabase";
import Header from "./components/Header";
import PortfolioGrid from "./components/PortfolioGrid";
import Lightbox from "./components/Lightbox";

export default function App() {
  const [photographs, setPhotographs] = useState<Photograph[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [layoutMode, setLayoutMode] = useState<"bento" | "grid" | "list">("bento");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Fetch photos from Supabase
  const fetchPhotos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      if (data) {
        setPhotographs(
          data.map((row) => ({
            id: row.id,
            title: row.title,
            category: row.category,
            url: row.url,
            photographer: row.photographer,
            date: row.date,
            settings: {
              aperture: row.aperture,
              shutter: row.shutter,
              iso: row.iso,
              focalLength: row.focal_length,
            },
            colSpan: row.col_span,
            rowSpan: row.row_span,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch photos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Filter photos based on categories
  const filteredPhotos =
    activeCategory === "All"
      ? photographs
      : photographs.filter((p) => p.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 selection:bg-white selection:text-black">
      {/* Ambient Dotted Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1e24_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.14] pointer-events-none" />

      {/* Dynamic Header */}
      <Header
        activeCategory={activeCategory}
        setActiveCategory={(cat) => {
          setActiveCategory(cat);
          setSelectedPhotoIndex(null);
        }}
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        photosCount={photographs.length}
      />

      {/* CSS-Grid Portfolio Container */}
      <main id="portfolio-main">
        <PortfolioGrid
          photos={filteredPhotos}
          layoutMode={layoutMode}
          onSelectPhoto={(index) => setSelectedPhotoIndex(index)}
        />
      </main>

      {/* Lightbox Trigger Modal */}
      {selectedPhotoIndex !== null && filteredPhotos[selectedPhotoIndex] && (
        <Lightbox
          photos={filteredPhotos}
          currentIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
          onNavigate={(newIndex) => setSelectedPhotoIndex(newIndex)}
        />
      )}

      {/* Premium Minimal Editorial Footer */}
      <footer
        id="portfolio-footer"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 border-t border-zinc-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-zinc-500 font-mono"
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-zinc-400 font-serif text-sm tracking-tight font-medium">
            CAPTURING LIGHT BY DRVSTELLA
          </span>
          <span>
            © 2026. All Rights Reserved.
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-zinc-800">|</span>
          <span className="text-zinc-600">INDIA</span>
        </div>
      </footer>
    </div>
  );
}
