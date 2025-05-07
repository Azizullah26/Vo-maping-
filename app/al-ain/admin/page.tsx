import AdminWrapper from "./AdminWrapper"
import { AuthProvider } from "@/app/contexts/AuthContext"

export const metadata = {
  title: "Al Ain Admin Dashboard",
  description: "Admin dashboard for Al Ain projects",
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminWrapper />
    </AuthProvider>
  )
}
