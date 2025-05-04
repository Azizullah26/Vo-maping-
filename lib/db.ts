// Demo data for when database is not configured
const DEMO_DOCUMENTS = [
  {
    id: "doc-1",
    title: "Zayed National Museum Overview",
    description: "Architectural plans and overview of the Zayed National Museum project",
    url: "/documents/zayed-museum-overview.pdf",
    createdAt: "2023-01-15T08:30:00Z",
    projectId: "zayed-museum",
  },
  {
    id: "doc-2",
    title: "Louvre Abu Dhabi Exhibition Schedule",
    description: "Upcoming exhibitions and events at the Louvre Abu Dhabi",
    url: "/documents/louvre-schedule.pdf",
    createdAt: "2023-02-20T10:15:00Z",
    projectId: "louvre-ad",
  },
  {
    id: "doc-3",
    title: "Al Ain Oasis Conservation Plan",
    description: "Detailed conservation plan for the historic Al Ain Oasis",
    url: "/documents/al-ain-oasis.pdf",
    createdAt: "2023-03-05T14:45:00Z",
    projectId: "al-ain-oasis",
  },
]

// Simple mock implementation that doesn't rely on external dependencies
export async function initializeDatabase(): Promise<any> {
  return { success: true, message: "Database initialization simulated" }
}

export async function checkDatabaseConnection(): Promise<boolean> {
  return true
}

export async function executeQuery(query: string, params: any[] = []): Promise<any> {
  console.log("Mock query execution:", query, params)
  return { success: true, data: [] }
}

export async function getAllDocuments() {
  return DEMO_DOCUMENTS
}

export async function getDocumentsByProject(projectId: string) {
  return DEMO_DOCUMENTS.filter((doc) => doc.projectId === projectId)
}

export async function addDocument(document: {
  title: string
  description: string
  url: string
  projectId?: string
}) {
  console.log("Mock document addition:", document)
  return { success: true, data: { id: "mock-id", ...document } }
}

export async function deleteDocument(documentId: string) {
  console.log("Mock document deletion:", documentId)
  return { success: true, data: { id: documentId } }
}

export async function isDatabaseConfigured(): Promise<boolean> {
  return true
}

export async function getProjectDocuments(projectId?: string) {
  if (projectId) {
    return getDocumentsByProject(projectId)
  }
  return getAllDocuments()
}
