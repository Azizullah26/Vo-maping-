import AdminPageClient from "./AdminPageClient"
import { AuthProvider } from "@/app/contexts/AuthContext"

export const metadata = {
  title: "Al Ain Admin Dashboard",
  description: "Admin dashboard for Al Ain projects",
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminPageClient />
    </AuthProvider>
  )
}
