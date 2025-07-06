export interface Project16 {
  id: string
  name: string
  nameAr: string
  percentageCoordinates: [number, number] // Changed from pixelCoordinates to percentageCoordinates
  description: string
  status: "completed" | "in-progress" | "planned"
  category: "residential" | "commercial" | "infrastructure" | "public"
}

export const projects16: Project16[] = [
  {
    id: "project-1",
    name: "Al Ain Oasis Development",
    nameAr: "تطوير واحة العين",
    percentageCoordinates: [60.7, 81.25], // Converted from [850, 650] assuming 1400x800 base
    description: "Heritage oasis restoration and development project",
    status: "in-progress",
    category: "public",
  },
  {
    id: "project-2",
    name: "Central Park Complex",
    nameAr: "مجمع الحديقة المركزية",
    percentageCoordinates: [53.6, 50.0], // Converted from [750, 400]
    description: "Modern recreational and commercial complex",
    status: "planned",
    category: "commercial",
  },
  {
    id: "project-3",
    name: "Residential District A",
    nameAr: "المنطقة السكنية أ",
    percentageCoordinates: [42.9, 37.5], // Converted from [600, 300]
    description: "Modern residential housing development",
    status: "completed",
    category: "residential",
  },
  {
    id: "project-4",
    name: "Infrastructure Hub",
    nameAr: "مركز البنية التحتية",
    percentageCoordinates: [64.3, 25.0], // Converted from [900, 200]
    description: "Utilities and infrastructure development",
    status: "in-progress",
    category: "infrastructure",
  },
  {
    id: "project-5",
    name: "Commercial Center East",
    nameAr: "المركز التجاري الشرقي",
    percentageCoordinates: [71.4, 56.25], // Converted from [1000, 450]
    description: "Shopping and business district",
    status: "planned",
    category: "commercial",
  },
  {
    id: "project-6",
    name: "Green Corridor",
    nameAr: "الممر الأخضر",
    percentageCoordinates: [50.0, 75.0], // Converted from [700, 600]
    description: "Environmental conservation and landscaping",
    status: "in-progress",
    category: "public",
  },
  {
    id: "project-7",
    name: "Heritage Village",
    nameAr: "القرية التراثية",
    percentageCoordinates: [35.7, 62.5], // Converted from [500, 500]
    description: "Traditional architecture preservation project",
    status: "completed",
    category: "public",
  },
  {
    id: "project-8",
    name: "Sports Complex",
    nameAr: "المجمع الرياضي",
    percentageCoordinates: [28.6, 43.75], // Converted from [400, 350]
    description: "Multi-purpose sports and recreation facility",
    status: "in-progress",
    category: "public",
  },
  {
    id: "project-9",
    name: "Residential District B",
    nameAr: "المنطقة السكنية ب",
    percentageCoordinates: [21.4, 50.0], // Converted from [300, 400]
    description: "Affordable housing development",
    status: "planned",
    category: "residential",
  },
  {
    id: "project-10",
    name: "Technology Park",
    nameAr: "حديقة التكنولوجيا",
    percentageCoordinates: [57.1, 37.5], // Converted from [800, 300]
    description: "Innovation and technology hub",
    status: "planned",
    category: "commercial",
  },
  {
    id: "project-11",
    name: "Water Treatment Plant",
    nameAr: "محطة معالجة المياه",
    percentageCoordinates: [78.6, 75.0], // Converted from [1100, 600]
    description: "Advanced water treatment facility",
    status: "completed",
    category: "infrastructure",
  },
  {
    id: "project-12",
    name: "Cultural Center",
    nameAr: "المركز الثقافي",
    percentageCoordinates: [46.4, 31.25], // Converted from [650, 250]
    description: "Arts and cultural activities center",
    status: "in-progress",
    category: "public",
  },
  {
    id: "project-13",
    name: "Medical Complex",
    nameAr: "المجمع الطبي",
    percentageCoordinates: [39.3, 75.0], // Converted from [550, 600]
    description: "Healthcare and medical services facility",
    status: "completed",
    category: "public",
  },
  {
    id: "project-14",
    name: "Educational Campus",
    nameAr: "الحرم التعليمي",
    percentageCoordinates: [32.1, 25.0], // Converted from [450, 200]
    description: "Modern educational facilities",
    status: "in-progress",
    category: "public",
  },
  {
    id: "project-15",
    name: "Transportation Hub",
    nameAr: "مركز النقل",
    percentageCoordinates: [53.6, 62.5], // Converted from [750, 500]
    description: "Public transportation and logistics center",
    status: "planned",
    category: "infrastructure",
  },
  {
    id: "project-16",
    name: "Solar Energy Farm",
    nameAr: "مزرعة الطاقة الشمسية",
    percentageCoordinates: [85.7, 50.0], // Converted from [1200, 400]
    description: "Renewable energy generation facility",
    status: "in-progress",
    category: "infrastructure",
  },
]
