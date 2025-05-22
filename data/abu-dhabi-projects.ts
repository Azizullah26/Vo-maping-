export interface Project {
  id: string
  name: string
  coordinates: [number, number]
  region: string
  type: string
  plots: number
  status: "available" | "sold out"
  image: string
  location: string
  description?: string
  handover?: string
  features?: string[]
}

export interface ProjectRegion {
  id: string
  name: string
  coordinates: [number, number][]
  color?: string
}

export const projects: Project[] = [
  {
    id: "1",
    name: "Al Falah",
    coordinates: [54.65, 24.42],
    region: "mainland",
    type: "Mixed Use",
    plots: 2,
    status: "sold out",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20092221-yygdWfbwOKnPgz8QnLVQL79WX0Cd72.png",
    location: "Abu Dhabi Mainland",
  },
  {
    id: "2",
    name: "Al Gurm",
    coordinates: [54.32, 24.46],
    region: "mainland",
    type: "Land",
    plots: 71,
    status: "available",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20092221-yygdWfbwOKnPgz8QnLVQL79WX0Cd72.png",
    location: "Abu Dhabi Mainland",
  },
  {
    id: "3",
    name: "Al Merief",
    coordinates: [54.62, 24.45],
    region: "mainland",
    type: "Mixed Use",
    plots: 2,
    status: "sold out",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20092221-yygdWfbwOKnPgz8QnLVQL79WX0Cd72.png",
    location: "Abu Dhabi Mainland",
  },
  {
    id: "4",
    name: "Al Raha Beach",
    coordinates: [54.54, 24.52],
    region: "mainland",
    type: "Mixed Use",
    plots: 2,
    status: "sold out",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20092221-yygdWfbwOKnPgz8QnLVQL79WX0Cd72.png",
    location: "Abu Dhabi Mainland",
  },
  {
    id: "5",
    name: "Alkaser",
    coordinates: [54.61, 24.48],
    region: "mainland",
    type: "Mixed Use",
    plots: 10,
    status: "available",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20092221-yygdWfbwOKnPgz8QnLVQL79WX0Cd72.png",
    location: "Abu Dhabi Mainland",
  },
  {
    id: "6",
    name: "Yas Acres North Bay",
    coordinates: [54.59, 24.49],
    region: "yas_island",
    type: "Residential",
    plots: 15,
    status: "available",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20113931-ih583HIda6FcfeLqu3KX2qNfcLUDlU.png",
    location: "Yas Island",
  },
  {
    id: "7",
    name: "Yas Acres The Magnolias",
    coordinates: [54.58, 24.48],
    region: "yas_island",
    type: "Residential",
    plots: 12,
    status: "available",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20113931-ih583HIda6FcfeLqu3KX2qNfcLUDlU.png",
    location: "Yas Island",
  },
  {
    id: "8",
    name: "Yas Acres The Dahlias",
    coordinates: [54.58, 24.47],
    region: "yas_island",
    type: "Residential",
    plots: 10,
    status: "available",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20113931-ih583HIda6FcfeLqu3KX2qNfcLUDlU.png",
    location: "Yas Island",
  },
  {
    id: "9",
    name: "Yas Park Gate",
    coordinates: [54.59, 24.46],
    region: "yas_island",
    type: "Residential",
    plots: 20,
    status: "available",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20113931-ih583HIda6FcfeLqu3KX2qNfcLUDlU.png",
    location: "Yas Island",
  },
  {
    id: "10",
    name: "Noya Luma",
    coordinates: [54.6, 24.45],
    region: "yas_island",
    type: "Residential",
    plots: 18,
    status: "available",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20113931-ih583HIda6FcfeLqu3KX2qNfcLUDlU.png",
    location: "Yas Island",
  },
  {
    id: "11",
    name: "Noya",
    coordinates: [54.61, 24.45],
    region: "yas_island",
    type: "Residential",
    plots: 22,
    status: "available",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20113931-ih583HIda6FcfeLqu3KX2qNfcLUDlU.png",
    location: "Yas Island",
  },
  {
    id: "12",
    name: "Noya Viva",
    coordinates: [54.62, 24.45],
    region: "yas_island",
    type: "Residential",
    plots: 16,
    status: "available",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20113931-ih583HIda6FcfeLqu3KX2qNfcLUDlU.png",
    location: "Yas Island",
  },
  {
    id: "13",
    name: "Yas Golf Collection",
    coordinates: [54.57, 24.44],
    region: "yas_island",
    type: "Residential",
    plots: 14,
    status: "available",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20113931-ih583HIda6FcfeLqu3KX2qNfcLUDlU.png",
    location: "Yas Island",
  },
  {
    id: "14",
    name: "Ansam",
    coordinates: [54.58, 24.43],
    region: "yas_island",
    type: "Residential",
    plots: 8,
    status: "sold out",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20113931-ih583HIda6FcfeLqu3KX2qNfcLUDlU.png",
    location: "Yas Island",
  },
  {
    id: "15",
    name: "Water's Edge",
    coordinates: [54.6, 24.42],
    region: "yas_island",
    type: "Residential",
    plots: 25,
    status: "available",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20113931-ih583HIda6FcfeLqu3KX2qNfcLUDlU.png",
    location: "Yas Island",
  },
  {
    id: "16",
    name: "Gardenia Bay",
    coordinates: [54.61, 24.42],
    region: "yas_island",
    type: "Residential",
    plots: 12,
    status: "available",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20113931-ih583HIda6FcfeLqu3KX2qNfcLUDlU.png",
    location: "Yas Island",
  },
  {
    id: "17",
    name: "Reflection",
    coordinates: [54.35, 24.45],
    region: "saadiyat_island",
    type: "Residential",
    plots: 8,
    status: "available",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20092221-yygdWfbwOKnPgz8QnLVQL79WX0Cd72.png",
    location: "Saadiyat Island",
  },
  {
    id: "18",
    name: "Saadiyat Lagoons",
    coordinates: [54.42, 24.53],
    region: "saadiyat_island",
    type: "Residential",
    plots: 15,
    status: "available",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20092221-yygdWfbwOKnPgz8QnLVQL79WX0Cd72.png",
    location: "Saadiyat Island",
  },
  {
    id: "19",
    name: "Mamsha Al Saadiyat",
    coordinates: [54.41, 24.54],
    region: "saadiyat_island",
    type: "Residential",
    plots: 10,
    status: "sold out",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20092221-yygdWfbwOKnPgz8QnLVQL79WX0Cd72.png",
    location: "Saadiyat Island",
  },
  {
    id: "20",
    name: "Jawaher Al Saadiyat",
    coordinates: [54.43, 24.54],
    region: "saadiyat_island",
    type: "Residential",
    plots: 6,
    status: "sold out",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-20%20092221-yygdWfbwOKnPgz8QnLVQL79WX0Cd72.png",
    location: "Saadiyat Island",
  },
]
