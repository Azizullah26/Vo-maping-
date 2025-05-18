import { CuboidIcon as Cube } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 flex items-center justify-center">
      <div className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-lg border border-cyan-500/30 text-center">
        <div className="animate-spin mb-4">
          <Cube className="h-12 w-12 text-cyan-400 mx-auto" />
        </div>
        <p className="text-cyan-400 text-lg">Loading 3D Models...</p>
        <p className="text-slate-400 text-sm mt-2">Please wait while we prepare the 3D environment</p>
      </div>
    </div>
  )
}
