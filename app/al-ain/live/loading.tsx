export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-bold text-cyan-400 mb-2">Loading Live Feeds</h2>
      <p className="text-slate-400">Connecting to camera network...</p>
    </div>
  )
}
