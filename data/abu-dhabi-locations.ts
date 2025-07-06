export interface LocationData {
  id: string
  name: string
  type: "hospital" | "police" | "urgent-point" | "civil-defense" | "clinic" | "office"
  position: { top: number; left: number }
  labelPosition?: { top: number; left: number }
  labelSize?: { width: number; height: number }
}

export const abuDhabiLocations: LocationData[] = [
  {
    id: "hospital-1",
    name: "Hospital - Location 1",
    type: "hospital",
    position: { top: 1103, left: 1347 },
  },
  {
    id: "hospital-2",
    name: "Hospital - Location 2",
    type: "hospital",
    position: { top: 978, left: 1095 },
  },
  {
    id: "police-1",
    name: "Police Station - Location 1",
    type: "police",
    position: { top: 1123, left: 1073 },
  },
  {
    id: "police-2",
    name: "Police Station - Location 2",
    type: "police",
    position: { top: 1183, left: 1183 },
  },
  {
    id: "urgent-point-al-aliah",
    name: "Urgent Point - Al Aliah",
    type: "urgent-point",
    position: { top: 589, left: 1134 },
    labelPosition: { top: 562, left: 1190 },
    labelSize: { width: 164, height: 26 },
  },
  {
    id: "urgent-point-al-nahdha",
    name: "Urgent Point - Al Nahdha",
    type: "urgent-point",
    position: { top: 1502, left: 1328 },
    labelPosition: { top: 1474, left: 1252 },
    labelSize: { width: 161, height: 25 },
  },
  {
    id: "urgent-point-al-bahyah",
    name: "Urgent Point - Al Bahyah",
    type: "urgent-point",
    position: { top: 787, left: 1389 },
    labelPosition: { top: 787, left: 1389 },
    labelSize: { width: 163, height: 29 },
  },
  // Add more locations as needed...
]
