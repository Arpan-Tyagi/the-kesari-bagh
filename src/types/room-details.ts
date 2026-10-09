// Room Detail & Architectural Specification Types for The Kesari Bagh

export interface RoomEnSuiteSpecs {
  surface: string;
  showerType: string;
  toiletries: string;
  features: string[];
}

export interface RoomNarrativeSpec {
  intro: string;
  atmosphere: string;
  architecture: string;
}

export interface MaterialPaletteSpec {
  name: string;
  hex: string;
  desc: string;
}

export interface AmenityCategoryGroup {
  category: string;
  items: { name: string; detail: string }[];
}

export interface FloorPlanMetricsSpec {
  bedroomM2: number;
  bathroomM2: number;
  outdoorM2: number;
  ceilingMeters: number;
}

export interface RoomGalleryItem {
  src: string;
  alt: string;
  caption: string;
}

export interface RoomDetailSpec {
  slug: string;
  keyNumber: string;
  tagline: string;
  heroSubtitle: string;
  compassOrientation: string;
  ceilingHeight: string;
  flooringMaterial: string;
  outdoorSpaceDesc: string;
  enSuiteSpecs: RoomEnSuiteSpecs;
  narrative: RoomNarrativeSpec;
  paletteMaterials: MaterialPaletteSpec[];
  amenitiesByCategory: AmenityCategoryGroup[];
  floorPlanMetrics: FloorPlanMetricsSpec;
  galleryImages: RoomGalleryItem[];
}
