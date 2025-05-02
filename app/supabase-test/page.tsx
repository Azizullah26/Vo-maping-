import SupabaseConnectionTest from "@/components/SupabaseConnectionTest"

export default function SupabaseTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      <SupabaseConnectionTest />
    </div>
  )
}
