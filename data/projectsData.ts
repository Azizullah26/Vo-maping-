export interface Project {
  id: string
  name: string
  coordinates: [number, number]
  description: string
}

export const projects: Project[] = [
  {
    id: "1",
    name: "Saadiyat Island",
    coordinates: [54.437, 24.534],
    description: "A cultural hub featuring world-class museums and educational institutions.",
  },
  {
    id: "2",
    name: "Louvre Abu Dhabi",
    coordinates: [54.4008, 24.5361],
    description: "An art and civilization museum, established in 2017.",
  },
  {
    id: "3",
    name: "Zayed National Museum",
    coordinates: [54.4041, 24.5328],
    description: "A planned museum dedicated to the history and culture of the UAE.",
  },
  {
    id: "4",
    name: "Guggenheim Abu Dhabi",
    coordinates: [54.4141, 24.5361],
    description: "A planned museum of modern and contemporary art.",
  },
  {
    id: "5",
    name: "New York University Abu Dhabi",
    coordinates: [54.4376, 24.5225],
    description: "A private research university established in partnership with NYU.",
  },
]
