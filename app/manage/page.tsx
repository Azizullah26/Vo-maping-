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
  ClipboardList,
} from "lucide-react"

export default function ManagePage() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const managementCards = [
    {
      id: "work-order",
      title: "Work Order",
      description: "Manage work orders, assignments, and task tracking",
      icon: ClipboardList,
      link: "/work-order",
      color: "from-orange-600/20 to-amber-600/20",
      borderColor: "border-orange-500/30",
      hoverColor: "group-hover:text-orange-400",
      fileCount: 12,
      lastUpdate: "2024-01-15",
    },
    {
      id: "projects",
      title: "Project Management",
      description: "Add, edit, and delete projects across all regions",
      icon: Building,
      link: "/projects",
      color: "from-blue-600/20 to-cyan-600/20",
      borderColor: "border-cyan-500/30",
      hoverColor: "group-hover:text-cyan-400",
      lastUpdate: "2024-01-12",
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
      lastUpdate: "2024-01-10",
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
      lastUpdate: "2024-01-08",
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
      lastUpdate: "2024-01-05",
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
      lastUpdate: "2024-01-03",
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
      lastUpdate: "2024-01-01",
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
      lastUpdate: "2023-12-28",
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
      lastUpdate: "2023-12-25",
    },
    {
      id: "admin-dashboard",
      title: "Admin Dashboard",
      description: "Access the main administrative dashboard",
      icon: Shield,
      link: "/al-ain/admin",
      color: "from-teal-600/20 to-cyan-600/20",
      borderColor: "border-teal-500/30",
      hoverColor: "group-hover:text-teal-400",
      lastUpdate: "2023-12-20",
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
                <div className="flex items-center gap-2">
                  <card.icon
                    className={`h-8 w-8 ${hoveredCard === card.id ? "text-white" : "text-gray-400"} transition-colors duration-300 ${card.hoverColor}`}
                  />
                  {card.fileCount && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {card.fileCount}
                    </span>
                  )}
                </div>
                <ChevronRight
                  className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${hoveredCard === card.id ? "translate-x-1" : ""}`}
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{card.description}</p>
              <p className="mt-2 text-xs text-gray-500">Last updated: {card.lastUpdate}</p>

              {/* Enhanced 3D Card Design */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="relative h-full w-full bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl overflow-hidden">
                  {/* Animated circles logo area */}
                  <div className="absolute top-4 right-4 flex items-center justify-center">
                    <div className="relative w-12 h-12">
                      <span
                        className="absolute inset-0 w-3 h-3 bg-cyan-400 rounded-full animate-ping"
                        style={{ animationDelay: "0s" }}
                      ></span>
                      <span
                        className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                      <span
                        className="absolute bottom-1 left-1 w-2 h-2 bg-purple-400 rounded-full animate-ping"
                        style={{ animationDelay: "0.4s" }}
                      ></span>
                      <span
                        className="absolute bottom-0 right-2 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping"
                        style={{ animationDelay: "0.6s" }}
                      ></span>
                      <span className="absolute top-2 left-2 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                        <card.icon className="w-2.5 h-2.5 text-white" />
                      </span>
                    </div>
                  </div>

                  {/* Glass effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

                  {/* Enhanced content */}
                  <div className="relative p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{card.description}</p>
                    </div>

                    {/* Bottom section with enhanced styling */}
                    <div className="mt-4 space-y-3">
                      {/* Social/action buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <button className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* View more button */}
                        <div className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 transition-colors">
                          <span className="text-xs font-medium">View more</span>
                          <svg
                            className="w-4 h-4 transform group-hover:translate-y-0.5 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </div>

                      {/* Last updated info */}
                      <div className="text-xs text-gray-400 border-t border-gray-700/50 pt-2">
                        Last updated: {card.lastUpdate}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced border glow */}
                  <div className="absolute inset-0 rounded-xl border-2 border-gradient-to-r from-cyan-500/50 to-blue-500/50 pointer-events-none"></div>
                </div>
              </div>
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
