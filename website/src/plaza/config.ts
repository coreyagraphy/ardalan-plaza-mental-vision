/** Corner palazzo wrapping Main Street and 4th Ave SW.
 *  Orientation from the aerial concept plate: chamfer faces the fountain.
 *  Dimensions estimated, not a survey. */

export const SCALE_NOTE =
  "Estimated visual scale. Corner palazzo at Main & 4th Ave SW, chamfer facing the roundabout. Not a measured survey.";

export const LABEL =
  "Mental Vision | Independent concept visualization | Not an approved plan";

export const VISION_PLATE = "/references/vision/district-composite.png";
export const CORNER_PLATE = "/references/vision/corner-orientation.png";

/** +X east (3rd Ave SW). +Y up. +Z north (Main Street).
 *  West facade addresses 4th Ave SW. NW chamfer faces the fountain. */
export const NORTH_Z = 0;

export const STORY = {
  ground: 4.55,
  typical: 3.55,
  attic: 3.15,
  cornice: 0.48,
};

export function eaveHeight(stories: number) {
  if (stories <= 1) return STORY.ground;
  return STORY.ground + STORY.typical * (stories - 1);
}

/**
 * Unified 3-story corner palazzo. Chamfer cut at the NW corner so the
 * entrance faces the roundabout, matching the orientation plate.
 */
export const BUILDING = {
  west: 0,
  east: 38.4,
  north: NORTH_Z,
  south: -36.2,
  chamfer: 9.2,
  stories: 3 as const,
};

export const FOOTPRINT = {
  west: BUILDING.west,
  east: BUILDING.east,
  north: BUILDING.north,
  south: BUILDING.south,
};

export const STREET = {
  sidewalkW: 4.2,
  curb: 0.14,
  laneW: 8.4,
  treeLine: 2.15,
};

const CHAMFER_MID = {
  x: BUILDING.west + BUILDING.chamfer / 2,
  z: BUILDING.north - BUILDING.chamfer / 2,
};

/** Fountain sits in the intersection, in front of the chamfered corner. */
export const ROUNDABOUT = {
  x: CHAMFER_MID.x - 12.6,
  z: CHAMFER_MID.z + 12.6,
  islandR: 7.6,
  roadW: 7.4,
  outerR: 15.0,
} as const;

export const FOUNTAIN = {
  x: ROUNDABOUT.x,
  z: ROUNDABOUT.z,
  poolR: 4.05,
};

export const FOURTH_AVE = {
  centerX: BUILDING.west - STREET.sidewalkW - STREET.laneW / 2,
  laneW: STREET.laneW,
};

export const THIRD_AVE = {
  centerX: BUILDING.east + 16,
  laneW: 8.0,
};

/** Sidewalk trees along Main (north) and 4th (west). None in the roundabout roadway. */
export const TREES: readonly [x: number, z: number, s: number][] = [
  [12.2, 2.35, 1.18],
  [18.6, 2.2, 1.08],
  [25.4, 2.4, 1.22],
  [32.2, 2.15, 1.1],
  [2.4, -14.6, 1.14],
  [2.2, -21.4, 1.2],
  [2.5, -28.2, 1.08],
  [8.4, 2.5, 1.05],
  [14.8, 32.8, 1.12],
  [26.2, 33.2, 1.18],
  [36.4, 32.4, 1.08],
  [-22.4, 34.6, 1.14],
  [-32.8, 33.8, 1.1],
];

export const SOURCE_PLATE = {
  src: "/references/official/01_StudioM_Exterior.jpg",
  aspect: 2500 / 1404,
  tx: 0,
  ty: 0,
  scale: 1,
};

export const CAMERAS = {
  source: {
    position: [-56.2, 13.9, 53.4] as const,
    target: [-3.0, 6.25, -3.4] as const,
    fov: 38.4,
  },
  establishing: {
    position: [-18.6, 10.4, 8.2] as const,
    target: [8.4, 4.4, -10.5] as const,
    fov: 40,
  },
  street: {
    position: [18.4, 1.72, 12.6] as const,
    target: [18.4, 2.5, 0] as const,
    fov: 55,
  },
  compare: {
    position: [22.2, 1.72, 13.2] as const,
    target: [22.2, 2.4, 0] as const,
    fov: 50,
  },
  aerial: {
    position: [-15.4, 31.5, 15.8] as const,
    target: [16.8, 3.2, -14.6] as const,
    fov: 42,
  },
  gallery: {
    position: [8.4, 1.56, -10.2] as const,
    target: [9.2, 1.48, 6.5] as const,
    fov: 48,
  },
  foyer: {
    position: [-2.4, 1.42, 3.2] as const,
    target: [6.8, 1.15, -6.4] as const,
    fov: 58,
  },
} as const;

export const FILM_FRAMES = 480;
export const FILM_FPS = 24;
export const FILM_SECONDS = 20;

/** Foyer behind the chamfered corner entrance. Interior concept — unverified. */
export const FOYER = {
  x0: BUILDING.west + 0.4,
  x1: BUILDING.west + BUILDING.chamfer - 0.35,
  zGlass: BUILDING.north - 0.4,
  zInside: BUILDING.north - 1.1,
  zArch: BUILDING.north - 6.4,
  zSouth: BUILDING.north - BUILDING.chamfer + 0.45,
  ceiling: STORY.ground - 0.08,
  doorW: 2.55,
  glassW: 6.4,
  glassH: 3.7,
} as const;

export const BUSINESS = [
  {
    id: "morning" as const,
    short: "Morning coffee",
    name: "Indie Coffee Roasters — Carmel Main",
    lens: "Walking, pickup, bikes, shade",
  },
  {
    id: "family" as const,
    short: "Family dining",
    name: "Bub’s Burgers & Ice Cream — Carmel",
    lens: "Arrival, waiting, dining",
  },
  {
    id: "evening" as const,
    short: "Evening dining",
    name: "Juniper on Main — Carmel",
    lens: "Storefront light, evening comfort",
  },
  {
    id: "art" as const,
    short: "Art / retail",
    name: "Indiana Artisan Gifts & Gallery — Carmel Rangeline",
    lens: "Browsing, window visibility",
  },
];
