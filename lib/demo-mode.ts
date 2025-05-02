/**
 * Demo mode functionality for when the Nile database is not available
 * This provides a fallback mechanism using in-memory storage
 */

// In-memory storage for documents
let documents = [
  {
    id: "1",
    title: "Sample Document 1",
    description: "This is a sample document for demo mode",
    url: "https://example.com/sample1.pdf",
    project_id: "zayed-national-museum",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Sample Document 2",
    description: "Another sample document for demo mode",
    url: "https://example.com/sample2.pdf",
    project_id: "saad-police-station",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Get all documents
export function getAllDocuments() {
  return { success: true, data: documents }
}

// Get a document by ID
export function getDocumentById(id: string) {
  const document = documents.find((doc) => doc.id === id)
  if (!document) {
    return { success: false, message: `Document with ID ${id} not found` }
  }
  return { success: true, data: document }
}

// Get documents for a project
export function getProjectDocuments(projectId: string) {
  const projectDocuments = documents.filter((doc) => doc.project_id === projectId)
  return { success: true, data: projectDocuments }
}

// Create a new document
export function createDocument(document: any) {
  const newDocument = {
    id: String(documents.length + 1),
    ...document,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  documents.push(newDocument)
  return { success: true, data: newDocument }
}

// Delete a document
export function deleteDocument(id: string) {
  const initialLength = documents.length
  documents = documents.filter((doc) => doc.id !== id)
  if (documents.length === initialLength) {
    return { success: false, message: `Document with ID ${id} not found` }
  }
  return { success: true, message: "Document deleted successfully" }
}
