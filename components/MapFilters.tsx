"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Landmark, Building, Map, School, Heart, ShoppingBag } from "lucide-react"

interface FilterOption {
  id: string
  label: string
  icon: React.ElementType
  count?: number
}

interface MapFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  showCategoryFilters?: boolean
  showTypeFilters?: boolean // Add this prop
}

export const typeFilters: FilterOption[] = [
  { id: "all", label: "All", icon: Map },
  { id: "residential", label: "Residential", icon: Building },
  { id: "land", label: "Land", icon: Landmark },
]

export function MapFilters({
  activeFilter,
  onFilterChange,
  showCategoryFilters = false,
  showTypeFilters = true, // Default to true for backward compatibility
}: MapFiltersProps) {
  const categoryFilters: FilterOption[] = [
    { id: "landmarks", label: "Landmarks", icon: Landmark, count: 8 },
    { id: "mosque", label: "Mosque", icon: Landmark, count: 5 },
    { id: "shopping", label: "Shopping", icon: ShoppingBag, count: 3 },
    { id: "education", label: "Education", icon: School, count: 4 },
    { id: "health", label: "Health", icon: Heart, count: 1 },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Type filters - only show if showTypeFilters is true */}
      {showTypeFilters && (
        <div className="flex justify-center gap-2">
          {typeFilters.map((filter) => (
            <Button
              key={filter.id}
              variant="ghost"
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                activeFilter === filter.id
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : filter.id === "residential" || filter.id === "land"
                    ? "bg-black/50 backdrop-blur-sm text-white hover:bg-white hover:text-black"
                    : "bg-black/50 backdrop-blur-sm text-white hover:bg-black/70",
              )}
              onClick={() => onFilterChange(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      )}

      {/* Category filters */}
      {showCategoryFilters && (
        <div className="fixed left-6 top-[80px] z-30 flex flex-col items-start max-w-[180px] bg-black/30 backdrop-blur-sm p-2 rounded-lg">
          <h4 className="text-xs font-medium text-white/80 mb-1 px-2">Categories</h4>
          <ul className="space-y-1 w-full">
            {categoryFilters.map((filter) => (
              <li key={filter.id}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-2 py-1 h-auto text-xs font-normal text-white hover:bg-white/10 rounded-md flex items-center gap-2"
                >
                  <filter.icon className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{filter.label}</span>
                  {filter.count !== undefined && (
                    <span className="ml-auto inline-flex items-center justify-center w-4 h-4 rounded-full bg-black/30 text-[10px] font-medium">
                      {filter.count}
                    </span>
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
