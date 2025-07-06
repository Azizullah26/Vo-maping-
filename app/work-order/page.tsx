"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ClipboardList,
  Calculator,
  FileBarChart,
  Presentation,
  Receipt,
  Mail,
  FileCheck,
  Map,
  DraftingCompassIcon as Drafting,
  Hand,
  ArrowLeft,
  ChevronRight,
} from "lucide-react"

export default function WorkOrderPage() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const workOrderItems = [
    {
      id: "work-order",
      title: "Work Order",
      description: "Create and manage work orders for projects",
      icon: ClipboardList,
      link: "/work-order/orders",
      color: "from-blue-100 to-blue-200",
      borderColor: "border-blue-300",
      hoverColor: "group-hover:text-blue-700",
    },
    {
      id: "estimation",
      title: "Estimation",
      description: "Calculate project costs and resource estimates",
      icon: Calculator,
      link: "/work-order/estimation",
      color: "from-emerald-100 to-emerald-200",
      borderColor: "border-emerald-300",
      hoverColor: "group-hover:text-emerald-700",
    },
    {
      id: "reports",
      title: "Reports",
      description: "Generate and view project reports",
      icon: FileBarChart,
      link: "/work-order/reports",
      color: "from-purple-100 to-purple-200",
      borderColor: "border-purple-300",
      hoverColor: "group-hover:text-purple-700",
    },
    {
      id: "presentation",
      title: "Presentation",
      description: "Create and manage project presentations",
      icon: Presentation,
      link: "/work-order/presentation",
      color: "from-amber-100 to-amber-200",
      borderColor: "border-amber-300",
      hoverColor: "group-hover:text-amber-700",
    },
    {
      id: "invoice",
      title: "Invoice",
      description: "Generate and manage project invoices",
      icon: Receipt,
      link: "/work-order/invoice",
      color: "from-rose-100 to-rose-200",
      borderColor: "border-rose-300",
      hoverColor: "group-hover:text-rose-700",
    },
    {
      id: "letters",
      title: "Letters",
      description: "Manage official correspondence and letters",
      icon: Mail,
      link: "/work-order/letters",
      color: "from-indigo-100 to-indigo-200",
      borderColor: "border-indigo-300",
      hoverColor: "group-hover:text-indigo-700",
    },
    {
      id: "building-permits",
      title: "Building Permits",
      description: "Track and manage building permits and approvals",
      icon: FileCheck,
      link: "/work-order/permits",
      color: "from-teal-100 to-teal-200",
      borderColor: "border-teal-300",
      hoverColor: "group-hover:text-teal-700",
    },
    {
      id: "site-plan",
      title: "Site Plan",
      description: "View and manage site plans and layouts",
      icon: Map,
      link: "/work-order/site-plan",
      color: "from-pink-100 to-pink-200",
      borderColor: "border-pink-300",
      hoverColor: "group-hover:text-pink-700",
    },
    {
      id: "drawing",
      title: "Drawing",
      description: "Access technical drawings and blueprints",
      icon: Drafting,
      link: "/work-order/drawing",
      color: "from-orange-100 to-orange-200",
      borderColor: "border-orange-300",
      hoverColor: "group-hover:text-orange-700",
    },
    {
      id: "site-handover",
      title: "Site Handover",
      description: "Manage site handover processes and documentation",
      icon: Hand,
      link: "/work-order/handover",
      color: "from-slate-100 to-slate-200",
      borderColor: "border-slate-300",
      hoverColor: "group-hover:text-slate-700",
    },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header with back button */}
      <div className="pt-16 pb-6 px-4">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
          >
            <ArrowLeft className="h-5 w-5 text-cyan-600" />
          </button>
          <h1 className="text-2xl font-bold text-orange-600">Work Order Management</h1>
        </div>
        <p className="text-gray-600 max-w-3xl">
          Manage all aspects of work orders, from creation to completion. Access tools for estimation, reporting,
          documentation, and project handover.
        </p>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {workOrderItems.map((item) => (
            <Link
              href={item.link}
              key={item.id}
              className={`group relative overflow-hidden rounded-xl border ${item.borderColor} bg-gradient-to-br ${item.color} backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-lg hover:shadow-orange-900/20 hover:border-orange-500/50 hover:-translate-y-1`}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-start justify-between">
                <item.icon
                  className={`h-8 w-8 ${hoveredCard === item.id ? "text-black" : "text-black"} transition-colors duration-300 ${item.hoverColor}`}
                />
                <ChevronRight
                  className={`h-5 w-5 text-black transition-transform duration-300 ${hoveredCard === item.id ? "translate-x-1" : ""}`}
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-black">{item.title}</h3>
              <p className="mt-2 text-sm text-black">{item.description}</p>

              {/* Glow effect on hover */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition duration-1000 group-hover:duration-200`}
              ></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <ClipboardList className="h-4 w-4 text-orange-500 mr-2" />
            <span className="text-xs text-gray-600">Work Order System</span>
          </div>
          <div className="text-xs text-gray-500">UAE Interactive Map - Work Management</div>
        </div>
      </div>
    </div>
  )
}
