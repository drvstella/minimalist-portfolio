export interface PhotoSettings {
  aperture: string;
  shutter: string;
  iso: number;
  focalLength: string;
}

export interface Photograph {
  id: string;
  title: string;
  category: "Street" | "Architecture" | "Landscape" | "Astro" | "Portrait";
  url: string;
  photographer: string;
  date: string;
  settings: PhotoSettings;
  colSpan: "col-span-1" | "col-span-2";
  rowSpan: "row-span-1" | "row-span-2";
}
