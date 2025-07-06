import { Suspense } from "react"
import AdminWrapper from "./AdminWrapper"
import DemoBanner from "./demo-banner"
import AdminLoading from "./loading"

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <div className="min-h-screen bg-gray-50">
        <DemoBanner />
        <AdminWrapper />
      </div>
    </Suspense>
  )
}
