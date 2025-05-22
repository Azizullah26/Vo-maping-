export interface ProjectRegion {
  id: string
  name: string
  coordinates: [number, number][] // Array of [longitude, latitude] pairs
  color?: string
}

// Define regions with their polygon coordinates
export const regions: ProjectRegion[] = [
  {
    id: "yas-island",
    name: "Yas Island",
    coordinates: [
      [54.59, 24.48],
      [54.62, 24.48],
      [54.62, 24.45],
      [54.59, 24.45],
    ],
    color: "#4a90e2",
  },
  {
    id: "saadiyat-island",
    name: "Saadiyat Island",
    coordinates: [
      [54.41, 24.55],
      [54.45, 24.55],
      [54.45, 24.52],
      [54.41, 24.52],
    ],
    color: "#50e3c2",
  },
  {
    id: "al-reem-island",
    name: "Al Reem Island",
    coordinates: [
      [54.38, 24.5],
      [54.42, 24.5],
      [54.42, 24.47],
      [54.38, 24.47],
    ],
    color: "#f5a623",
  },
  {
    id: "al-raha-beach",
    name: "Al Raha Beach",
    coordinates: [
      [54.52, 24.44],
      [54.56, 24.44],
      [54.56, 24.42],
      [54.52, 24.42],
    ],
    color: "#d0021b",
  },
]
