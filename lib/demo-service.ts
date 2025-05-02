// Demo mode service
let demoModeEnabled = true

// Demo documents storage
interface DemoDocument {
  id: string
  project_id: string
  file_name: string
  file_type: string
  file_url: string
  description: string
  upload_date: string
}

// Initial demo documents
const initialDemoDocuments: Record<string, DemoDocument[]> = {
  "project-1": [
    {
      id: "1",
      project_id: "project-1",
      file_name: "Project Specifications.pdf",
      file_type: "application/pdf",
      file_url: "/demo-files/project-specs.pdf",
      description: "Detailed specifications for the project",
      upload_date: "2023-05-15T10:30:00Z",
    },
    {
      id: "2",
      project_id: "project-1",
      file_name: "Timeline.xlsx",
      file_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      file_url: "/demo-files/timeline.xlsx",
      description: "Project timeline and milestones",
      upload_date: "2023-06-01T14:45:00Z",
    },
  ],
  "zayed-national-museum": [
    {
      id: "3",
      project_id: "zayed-national-museum",
      file_name: "Museum Design.pdf",
      file_type: "application/pdf",
      file_url: "/demo-files/museum-design.pdf",
      description: "Architectural designs for the Zayed National Museum",
      upload_date: "2023-04-10T09:15:00Z",
    },
    {
      id: "4",
      project_id: "zayed-national-museum",
      file_name: "Exhibit Plan.docx",
      file_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      file_url: "/demo-files/exhibit-plan.docx",
      description: "Detailed plan for museum exhibits",
      upload_date: "2023-04-22T11:20:00Z",
    },
  ],
  "al-saad-police-center": [
    {
      id: "5",
      project_id: "al-saad-police-center",
      file_name: "Security Systems.pdf",
      file_type: "application/pdf",
      file_url: "/demo-files/security-systems.pdf",
      description: "Overview of security systems implementation",
      upload_date: "2023-03-05T13:40:00Z",
    },
  ],
}

// Function to get demo documents from localStorage or initial data
const getDemoDocuments = (): Record<string, DemoDocument[]> => {
  if (typeof window !== "undefined") {
    const storedDocs = localStorage.getItem("demoDocuments")
    if (storedDocs) {
      return JSON.parse(storedDocs)
    }
  }
  return { ...initialDemoDocuments }
}

// Function to save demo documents to localStorage
const saveDemoDocuments = (documents: Record<string, DemoDocument[]>) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("demoDocuments", JSON.stringify(documents))
  }
}

export const isDemoMode = () => demoModeEnabled

export const setDemoMode = (enabled: boolean) => {
  demoModeEnabled = enabled
}

export const getDemoProjectDocuments = (projectId: string): DemoDocument[] => {
  const documents = getDemoDocuments()
  return documents[projectId] || []
}

export const addDemoDocument = (document: Omit<DemoDocument, "id">): DemoDocument => {
  const documents = getDemoDocuments()
  const newId = Date.now().toString()
  const newDocument = {
    ...document,
    id: newId,
  }

  if (!documents[document.project_id]) {
    documents[document.project_id] = []
  }

  documents[document.project_id].push(newDocument)
  saveDemoDocuments(documents)

  return newDocument
}

export const clearDemoDocuments = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("demoDocuments")
  }
}

async function checkHealth() {
  return {
    success: true,
    message: "Demo mode is active and working correctly",
    timestamp: new Date().toISOString(),
  }
}
