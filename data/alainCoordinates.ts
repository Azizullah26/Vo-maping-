export interface PoliceLocation {
  name: string
  coordinates: [number, number]
  type: string
  description: string
}

export const alainPoliceLocations: PoliceLocation[] = [
  {
    name: "قسم موسيقى شرطة أبوظبي",
    coordinates: [55.76123, 24.20845],
    type: "music_department",
    description: "Abu Dhabi Police Music Department",
  },
  {
    name: "إدارة التأهيل الشرطي - الفوعة",
    coordinates: [55.78456, 24.21234],
    type: "training_center",
    description: "Police Rehabilitation Department - Al Foua",
  },
  {
    name: "مركز شرطة هيلي",
    coordinates: [55.76789, 24.19876],
    type: "police_station",
    description: "Hili Police Station",
  },
  {
    name: "ميدان الشرطة بدع بنت سعود",
    coordinates: [55.75234, 24.18765],
    type: "police_square",
    description: "Police Square Bada Bint Saud",
  },
  {
    name: "متحف شرطة المربعة",
    coordinates: [55.74567, 24.17654],
    type: "museum",
    description: "Al Murabba Police Museum",
  },
  {
    name: "مركز شرطة المربعة",
    coordinates: [55.7489, 24.1789],
    type: "police_station",
    description: "Al Murabba Police Station",
  },
  {
    name: "مديرية شرطة العين",
    coordinates: [55.75123, 24.18123],
    type: "directorate",
    description: "Al Ain Police Directorate",
  },
  {
    name: "فرع النقل والمشاغل",
    coordinates: [55.75456, 24.18456],
    type: "transport_branch",
    description: "Transport and Workshops Branch",
  },
  {
    name: "نادي ضباط الشرطة",
    coordinates: [55.75789, 24.18789],
    type: "officers_club",
    description: "Police Officers Club",
  },
  {
    name: "مركز شرطة زاخر",
    coordinates: [55.76012, 24.19012],
    type: "police_station",
    description: "Zakher Police Station",
  },
  {
    name: "فلل فلج هزاع",
    coordinates: [55.76345, 24.19345],
    type: "residential_villas",
    description: "Falaj Hazza Villas",
  },
  {
    name: "فلل فلج هزاع (قسم الأدلة الجنائية - قسم الشرطة المجتمعية - قسم تأجير المركبات - قسم الاستقطاب)",
    coordinates: [55.76678, 24.19678],
    type: "specialized_departments",
    description: "Falaj Hazza Villas (Forensic Evidence - Community Police - Vehicle Rental - Recruitment)",
  },
  {
    name: "قسم هندسة المرور",
    coordinates: [55.76901, 24.19901],
    type: "k9_unit",
    description: "K9 Security Inspection Department",
  },
  {
    name: "الضبط المروري والمراسم",
    coordinates: [55.77234, 24.20234],
    type: "traffic_control",
    description: "Traffic Control and Ceremonies",
  },
  {
    name: "ساحة حجز المركبات فلج هزاع",
    coordinates: [55.77567, 24.20567],
    type: "impound_lot",
    description: "Falaj Hazza Vehicle Impound Lot",
  },
  {
    name: "إدارة المرور والترخيص",
    coordinates: [55.7789, 24.2089],
    type: "traffic_licensing",
    description: "Traffic and Licensing Department",
  },
  {
    name: "قسم الدوريات الخاصة",
    coordinates: [55.78123, 24.21123],
    type: "special_patrols",
    description: "Special Patrols Department",
  },
  {
    name: "إدارة الدوريات الخاصة",
    coordinates: [55.78456, 24.21456],
    type: "special_patrols_admin",
    description: "Special Patrols Administration",
  },
  {
    name: "المعهد المروري",
    coordinates: [55.78789, 24.21789],
    type: "traffic_institute",
    description: "Traffic Institute",
  },
  {
    name: "سكن أفراد المرور",
    coordinates: [55.79012, 24.22012],
    type: "traffic_housing",
    description: "Traffic Personnel Housing",
  },
  {
    name: "قسم هندسة المرور",
    coordinates: [55.79345, 24.22345],
    type: "traffic_engineering",
    description: "Traffic Engineering Department",
  },
  {
    name: "المتابعة الشرطية والرعاية اللاحقة",
    coordinates: [55.79678, 24.22678],
    type: "police_follow_up",
    description: "Police Follow-up and Aftercare",
  },
  {
    name: "ادارة المهام الخاصة العين",
    coordinates: [55.79901, 24.22901],
    type: "special_tasks",
    description: "Al Ain Special Tasks Administration",
  },
  {
    name: "مبنى التحريات والمخدرات",
    coordinates: [55.80234, 24.23234],
    type: "investigations_narcotics",
    description: "Investigations and Narcotics Building",
  },
  {
    name: "إدارة الأسلحة والمتفجرات",
    coordinates: [55.80567, 24.23567],
    type: "weapons_explosives",
    description: "Weapons and Explosives Administration",
  },
  {
    name: "مركز شرطة فلج هزاع",
    coordinates: [55.8089, 24.2389],
    type: "police_station",
    description: "Falaj Hazza Police Station",
  },
  {
    name: "فلل للادرات الشرطية عشارج",
    coordinates: [55.81123, 24.24123],
    type: "admin_villas",
    description: "Police Administration Villas Asharej",
  },
  {
    name: "مركز شرطة المقام",
    coordinates: [55.81456, 24.24456],
    type: "police_station",
    description: "Al Maqam Police Station",
  },
  {
    name: "مركز شرطة الوقن",
    coordinates: [55.82345, 24.25345],
    type: "police_station",
    description: "Al Wagan Police Station",
  },
  {
    name: "مركز شرطة الجيمي",
    coordinates: [55.82678, 24.25678],
    type: "police_station",
    description: "Al Jimi Police Station",
  },
  {
    name: "مركز شرطة القوع (فلل صحة)",
    coordinates: [55.83012, 24.26012],
    type: "police_station",
    description: "Al Qua Police Station (Health Villas)",
  },
  {
    name: "نقطة ثبات الروضة",
    coordinates: [55.83345, 24.26345],
    type: "checkpoint",
    description: "Al Rawda Fixed Point",
  },
  {
    name: "فرع الضبط المروري (الخزنة)",
    coordinates: [55.83678, 24.26678],
    type: "traffic_control_branch",
    description: "Traffic Control Branch (Al Khazna)",
  },
  {
    name: "مبنى إدارات (التربية الرياضية - الاعلام الامني - مسرح الجريمة - فرع البصمة)",
    coordinates: [55.84012, 24.27012],
    type: "admin_building",
    description: "Administration Building (Sports Education - Security Media - Crime Scene - Fingerprint Branch)",
  },
  {
    name: "مركز شرطة سويحان",
    coordinates: [55.84345, 24.27345],
    type: "police_station",
    description: "Sweihan Police Station",
  },
  {
    name: "مركز شرطة الهير",
    coordinates: [55.84678, 24.27678],
    type: "police_station",
    description: "Al Hair Police Station",
  },
  {
    name: "مركز شرطة الجيمي القديم",
    coordinates: [55.85012, 24.28012],
    type: "old_police_station",
    description: "Old Al Jimi Police Station",
  },
]

export const alainProjectLocations = [
  {
    name: "16 Projects",
    coordinates: [55.71402343413848, 24.191945156301003] as [number, number],
    type: "development_project",
    description: "16 Development Projects Area",
  },
]

// Combined locations for easy access
export const allAlainLocations = [...alainPoliceLocations, ...alainProjectLocations]

// Helper functions
export function getLocationByName(name: string): PoliceLocation | undefined {
  return allAlainLocations.find((location) => location.name === name)
}

export function getLocationsByType(type: string): PoliceLocation[] {
  return allAlainLocations.filter((location) => location.type === type)
}

export function getPoliceStations(): PoliceLocation[] {
  return alainPoliceLocations.filter((location) => location.type === "police_station")
}

export function getDevelopmentProjects(): PoliceLocation[] {
  return alainProjectLocations
}

// Bounds for Al Ain area
export const alainBounds = {
  southwest: [55.5, 24.0] as [number, number],
  northeast: [56.0, 24.5] as [number, number],
}

// Center point for Al Ain
export const alainCenter: [number, number] = [55.7, 24.2]

// Default zoom levels for different views
export const zoomLevels = {
  overview: 9.5,
  detailed: 12,
  close: 15,
}
