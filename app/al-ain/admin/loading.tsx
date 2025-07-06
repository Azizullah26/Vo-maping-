export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading Admin Panel...</p>
      </div>
    </div>
  )
}
