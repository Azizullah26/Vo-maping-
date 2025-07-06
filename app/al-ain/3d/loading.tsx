export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
        <p className="text-white text-lg">Loading 3D View...</p>
      </div>
    </div>
  )
}
