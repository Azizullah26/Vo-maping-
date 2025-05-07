// Mock implementation for build time
module.exports = {
  checkDatabaseConnection: async () => false,
  initializeDatabase: async () => false,
  executeQuery: async () => ({ success: false, error: "Mock implementation" }),
  getAllDocuments: async () => [],
  getDocumentsByProject: async () => [],
  addDocument: async () => ({ success: false, error: "Mock implementation" }),
  deleteDocument: async () => ({ success: false, error: "Mock implementation" }),
  isDatabaseConfigured: async () => false,
  getProjectDocuments: async () => [],
}
