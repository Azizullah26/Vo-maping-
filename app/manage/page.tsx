"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  FileText,
  Map,
  Users,
  Settings,
  BarChart3,
  ChevronRight,
  Building,
  Database,
  Upload,
  Shield,
  ArrowLeft,
} from "lucide-react"

export default function ManagePage() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const managementCards = [
    {
      id: "projects",
      title: "Project Management",
      description: "Add, edit, and delete projects across all regions",
      icon: Building,
      link: "/projects",
      color: "from-blue-600/20 to-cyan-600/20",
      borderColor: "border-cyan-500/30",
      hoverColor: "group-hover:text-cyan-400",
    },
    {
      id: "documents",
      title: "Document Management",
      description: "Upload and organize documents and files",
      icon: FileText,
      link: "/al-ain/documents",
      color: "from-emerald-600/20 to-green-600/20",
      borderColor: "border-emerald-500/30",
      hoverColor: "group-hover:text-emerald-400",
    },
    {
      id: "maps",
      title: "Map Configuration",
      description: "Configure map settings and markers",
      icon: Map,
      link: "/",
      color: "from-amber-600/20 to-yellow-600/20",
      borderColor: "border-amber-500/30",
      hoverColor: "group-hover:text-amber-400",
    },
    {
      id: "users",
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: Users,
      link: "/admin",
      color: "from-purple-600/20 to-violet-600/20",
      borderColor: "border-purple-500/30",
      hoverColor: "group-hover:text-purple-400",
    },
    {
      id: "settings",
      title: "System Settings",
      description: "Configure application settings and preferences",
      icon: Settings,
      link: "/admin",
      color: "from-gray-600/20 to-slate-600/20",
      borderColor: "border-gray-500/30",
      hoverColor: "group-hover:text-gray-400",
    },
    {
      id: "analytics",
      title: "Analytics & Reports",
      description: "View system usage and generate reports",
      icon: BarChart3,
      link: "/admin",
      color: "from-red-600/20 to-rose-600/20",
      borderColor: "border-red-500/30",
      hoverColor: "group-hover:text-red-400",
    },
    {
      id: "database",
      title: "Database Management",
      description: "Manage database connections and data",
      icon: Database,
      link: "/al-ain/admin/database-setup",
      color: "from-indigo-600/20 to-blue-600/20",
      borderColor: "border-indigo-500/30",
      hoverColor: "group-hover:text-indigo-400",
    },
    {
      id: "uploads",
      title: "Media Upload",
      description: "Upload and manage media files",
      icon: Upload,
      link: "/test-upload",
      color: "from-pink-600/20 to-rose-600/20",
      borderColor: "border-pink-500/30",
      hoverColor: "group-hover:text-pink-400",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header with back button */}
      <div className="pt-16 pb-6 px-4">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-700/50"
          >
            <ArrowLeft className="h-5 w-5 text-cyan-400" />
          </button>
          <h1 className="text-2xl font-bold text-cyan-400">Management Dashboard</h1>
        </div>
        <p className="text-gray-400 max-w-3xl">
          Welcome to the management dashboard. Use the cards below to navigate to different management sections.
        </p>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {managementCards.map((card) => (
            <Link
              href={card.link}
              key={card.id}
              className={`group relative overflow-hidden rounded-xl border ${card.borderColor} bg-gradient-to-br ${card.color} backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/20 hover:border-cyan-500/50 hover:-translate-y-1`}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-start justify-between">
                <card.icon
                  className={`h-8 w-8 ${hoveredCard === card.id ? "text-white" : "text-gray-400"} transition-colors duration-300 ${card.hoverColor}`}
                />
                <ChevronRight
                  className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${hoveredCard === card.id ? "translate-x-1" : ""}`}
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{card.description}</p>

              {/* Glow effect on hover */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition duration-1000 group-hover:duration-200`}
              ></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="h-4 w-4 text-cyan-500 mr-2" />
            <span className="text-xs text-gray-400">Admin Access</span>
          </div>
          <div className="text-xs text-gray-500">UAE Interactive Map Management</div>
        </div>
      </div>
    </div>
  )
}
