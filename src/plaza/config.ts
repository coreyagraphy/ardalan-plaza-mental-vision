/** Estimated visual reconstruction of Ardalan Plaza from published Studio M exterior
 *  plus the district vision composite (People / Place / Possibility).
 *  Dimensions are NOT surveyed. Hidden faces are simplified. */

export const SCALE_NOTE =
  "Estimated visual scale. Ardalan sits at the SE corner of Main Street and 4th Ave SW. Not a measured survey.";

export const LABEL =
  "Mental Vision | Independent concept visualization | Not an approved plan";

export const VISION_PLATE = "/references/vision/district-composite.png";

/** North facade faces +Z (Main Street). +X is east toward 3rd Ave SW. +Y up.
 *  West facade addresses 4th Ave SW and the gateway roundabout. Estimated, not georeferenced. */
export const NORTH_Z = 0;

export const STORY = {
  ground: 4.35,
  typical: 3.45,
  attic: 3.05,
  cornice: 0.42,
};

export function eaveHeight(stories: number) {
  if (stories <= 1) return STORY.ground;
  return STORY.ground + STORY.typical * (stories - 1);
}

/** Bay layout along Main Street, west → east. Widths are estimated.
 *  First floor ~8,000 sf: ~47.6 m frontage × ~16 m depth. */
export const BAYS = {
  west: { x0: -21.2, x1: -12.2, depth: 15.6, stories: 3 },
  loggia: { x0: -12.2, x1: -6.0, depth: 13.4, stories: 3, setback: 1.7 },
  tower: { x0: -6.0, x1: 6.2, depth: 16.2, stories: 4 },
  east: { x0: 6.2, x1: 26.4, depth: 15.8, stories: 3 },
} as const;

export const FOOTPRINT = {
  west: BAYS.west.x0,
  east: BAYS.east.x1,
  north: NORTH_Z,
  south: -16.4,
};

export const STREET = {
  sidewalkW: 3.6,
  curb: 0.14,
  laneW: 8.2,
  treeLine: 2.15,
};

/**
 * Gateway roundabout at Main Street & 4th Ave SW.
 * Building is the SE corner lot. Distances estimated from the published
 * Studio M relationship (fountain left, palazzo right) plus the 1-acre site.
 */
export const ROUNDABOUT = {
  x: -29.4,
  z: 17.2,
  islandR: 8.4,
  roadW: 7.2,
  outerR: 15.6,
} as const;

/** Fountain sits on the roundabout island — not a mid-block plaza basin. */
export const FOUNTAIN = {
  x: ROUNDABOUT.x,
  z: ROUNDABOUT.z,
  poolR: 4.15,
};

/** 4th Ave SW — west of the west pavilion. */
export const FOURTH_AVE = {
  centerX: BAYS.west.x0 - STREET.sidewalkW - STREET.laneW / 2,
  laneW: STREET.laneW,
};

/** 3rd Ave SW — east boundary of the 1-acre block, past the east wing. */
export const THIRD_AVE = {
  centerX: BAYS.east.x1 + 14.5,
  laneW: 8.0,
};

/** Street trees. None west of the corner — that is 4th Ave / the roundabout. */
export const TREES: readonly [x: number, z: number, s: number][] = [
  [-22.2, 2.25, 1.22],
  [-16.8, 2.1, 1.35],
  [-10.4, 1.9, 1.18],
  [-2.2, 2.0, 1.08],
  [6.4, 1.85, 1.0],
  [14.2, 2.05, 1.15],
  [22.4, 1.9, 1.08],
  [28.2, 2.15, 1.12],
  [-22.6, -6.4, 1.08],
  [-22.8, -12.2, 1.14],
  [8.4, 32.4, 1.12],
  [20.5, 31.2, 1.18],
  [32.2, 31.6, 1.08],
  [-8.4, 33.6, 1.24],
  [6.8, 33.2, 1.12],
];

/** Camera-matched published exterior. FOV is vertical at the plate's native aspect. */
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
    position: [-46.5, 9.8, 41.2] as const,
    target: [-6.0, 5.8, -2.2] as const,
    fov: 34,
  },
  street: {
    position: [8.5, 1.7, 11.4] as const,
    target: [8.5, 2.6, 0] as const,
    fov: 55,
  },
  compare: {
    position: [10.2, 1.72, 12.8] as const,
    target: [10.2, 2.4, 0] as const,
    fov: 50,
  },
  aerial: {
    position: [-48, 62, 68] as const,
    target: [-8, 3.5, 2] as const,
    fov: 44,
  },
  gallery: {
    position: [-0.55, 1.56, -8.35] as const,
    target: [0.35, 1.48, 9.5] as const,
    fov: 48,
  },
  foyer: {
    position: [0.15, 1.36, 1.65] as const,
    target: [-0.35, 0.38, -4.6] as const,
    fov: 60,
  },
} as const;

export const FILM_FRAMES = 480;
export const FILM_FPS = 24;
export const FILM_SECONDS = 20;

/** Tower ground-floor foyer. Interior concept — layout unverified. */
export const FOYER = {
  x0: BAYS.tower.x0 + 0.22,
  x1: BAYS.tower.x1 - 0.22,
  zGlass: NORTH_Z + 0.06,
  zInside: NORTH_Z - 0.22,
  zArch: NORTH_Z - 9.15,
  zSouth: NORTH_Z - BAYS.tower.depth + 0.22,
  ceiling: STORY.ground - 0.06,
  doorW: 2.35,
  glassW: 7.7,
  glassH: 3.58,
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
