import { Grid, Layers, StretchHorizontal, SlidersHorizontal, Sliders } from "lucide-react";

interface HeaderProps {
  activeCategory: string;
  setActiveCategory: (cat: any) => void;
  layoutMode: "bento" | "grid" | "list";
  setLayoutMode: (mode: "bento" | "grid" | "list") => void;
  photosCount: number;
}

export default function Header({
  activeCategory,
  setActiveCategory,
  layoutMode,
  setLayoutMode,
  photosCount
}: HeaderProps) {
  const categories = ["All", "Street", "Architecture", "Landscape", "Astro", "Portrait"];

  return (
    <header id="portfolio-header" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 flex flex-col gap-10">
      {/* Upper Meta-Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="flex items-center gap-2.5 font-mono text-[10px] sm:text-xs text-zinc-500 tracking-widest uppercase">
          <span>EXHIBIT • DRVSTELLASTUDIO</span>
          <span className="h-1.5 w-1.5 bg-zinc-700 rounded-full" />
          <span>EST. 2026</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
          <span className="font-sans text-zinc-600 font-light">Status:</span>
          <span className="text-emerald-500">Live Archiving</span>
        </div>
      </div>

      {/* Main Branding & Editorial Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Title */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-[1.1]">
            Stella <br className="hidden sm:inline" />
            <span className="italic text-zinc-400 font-light">Archivism</span>
          </h1>
          <p className="font-sans text-base text-zinc-400 font-light leading-relaxed max-w-xl">
            A minimalist digital space honoring pristine raw geometry, cosmic wilderness, warm available light, and silent metropolitan moments. Each selection includes full Exif records.
          </p>
        </div>

        {/* Gallery Statistics readouts */}
        <div className="lg:col-span-5 grid grid-cols-3 gap-4 h-full">
          <div className="flex flex-col justify-between bg-zinc-900/30 border border-zinc-900 rounded-xl p-4">
            <span className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase">Captures</span>
            <span className="font-serif text-2xl md:text-3xl text-white font-medium mt-1">{photosCount}</span>
          </div>
          <div className="flex flex-col justify-between bg-zinc-900/30 border border-zinc-900 rounded-xl p-4">
            <span className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase">Artists</span>
            <span className="font-serif text-2xl md:text-3xl text-white font-medium mt-1">1</span>
          </div>
          <div className="flex flex-col justify-between bg-zinc-900/30 border border-zinc-900 rounded-xl p-4">
            <span className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase">Lenses</span>
            <span className="font-serif text-2xl md:text-3xl text-white font-medium mt-1">1</span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE FILTERS & CONTROLS BOX */}
      <div className="flex flex-col gap-6 pt-2">
        <div className="h-px bg-zinc-900 w-full" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

          {/* Category Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5" id="category-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                id={`cat-btn-${cat.toLowerCase()}`}
                className={`px-4 py-2 rounded-full font-mono text-xs transition-colors duration-300 ${activeCategory === cat
                  ? "bg-zinc-100 text-zinc-950 font-medium"
                  : "bg-zinc-900/40 text-zinc-400 border border-zinc-900 hover:bg-zinc-900 hover:text-white"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Layout Switcher */}
          <div className="flex items-center gap-4.5">
            <div className="flex items-center gap-1 rounded-full bg-zinc-900/60 p-1 border border-zinc-900" id="layout-switcher-bar">
              {/* Bento mode */}
              <button
                onClick={() => setLayoutMode("bento")}
                id="layout-bento-btn"
                className={`p-2 rounded-full transition-all ${layoutMode === "bento"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
                  }`}
                title="Bento Mosaic Grid"
              >
                <Layers size={14} />
              </button>

              {/* Symmetric Grid Mode */}
              <button
                onClick={() => setLayoutMode("grid")}
                id="layout-grid-btn"
                className={`p-2 rounded-full transition-all ${layoutMode === "grid"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
                  }`}
                title="Equal Symmetric Grid"
              >
                <Grid size={14} />
              </button>

              {/* Single Column mode */}
              <button
                onClick={() => setLayoutMode("list")}
                id="layout-list-btn"
                className={`p-2 rounded-full transition-all ${layoutMode === "list"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
                  }`}
                title="Single Column list"
              >
                <StretchHorizontal size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
