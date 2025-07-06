// Marker validation and debugging component
export function validatePoliceMarkers() {
  const policeLocationsFromJSON = [
    "قسم موسيقى شرطة أبوظبي",
    "إدارة التأهيل الشرطي - الفوعة",
    "مركز شرطة هيلي",
    "مركز شرطة الهير",
    "مركز شرطة سويحان",
    "ميدان الشرطة بدع بنت سعود",
    "متحف شرطة المربعة",
    "مركز شرطة المربعة",
    "مركز شرطة الساد",
    "ساحة حجز المركبات - الساد",
    "ادارة المهام الخاصة العين",
    "مركز شرطة فلج هزاع",
    "قسم هندسة المرور",
    "المتابعة الشرطية والرعاية اللاحقة",
    "المعهد المروري",
    "إدارة الأسلحة والمتفجرات",
    "فلل فلج هزاع",
    "الضبط المروري والمراسم",
    "قسم الدوريات الخاصة",
    "سكن أفراد المرور",
    "إدارة الدوريات الخاصة",
    "قسم التفتيش الأمني K9",
    "ساحة حجز المركبات فلج هزاع",
    "مبنى التحريات والمخدرات",
    "مديرية شرطة العين",
    "نادي ضباط الشرطة",
    "فرع النقل والمشاغل",
    "مبنى إدارات الشرطة",
    "مركز شرطة رماح",
    "مركز شرطة زاخر",
    "مركز شرطة الوقن",
    "فلل للادرات الشرطية عشارج",
    "مركز شرطة المقام",
  ]

  console.log("Total police locations in JSON:", policeLocationsFromJSON.length)

  // Check for missing markers that should be visible
  const missingMarkers = policeLocationsFromJSON.filter((name) => {
    // Check if marker would be excluded by current logic
    return name !== "مبنى إدارات شرطة" // This one is excluded in code
  })

  console.log("Markers that should be created:", missingMarkers.length)
  return missingMarkers
}
