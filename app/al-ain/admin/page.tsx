import { Suspense } from "react"
import AdminWrapper from "./AdminWrapper"
import DemoBanner from "./demo-banner"
import AdminLoading from "./loading"

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <DemoBanner />
        <AdminWrapper />
      </div>
    </Suspense>
  )
}
