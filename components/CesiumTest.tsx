"use client"

export default function CesiumTest() {
  return (
    <div className="flex items-center justify-center bg-gray-100 h-96">
      <div className="text-center max-w-md p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Cesium Removed</h3>
        <p className="text-gray-600">
          The Cesium 3D library has been removed to reduce deployment size. The package was consuming over 500MB of disk
          space.
        </p>
      </div>
    </div>
  )
}
