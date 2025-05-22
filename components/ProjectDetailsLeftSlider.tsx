"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MapPin, Phone, Mail, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Project } from "@/data/abu-dhabi-projects"
import Image from "next/image"

interface ProjectDetailsLeftSliderProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
}

export function ProjectDetailsLeftSlider({ isOpen, onClose, project }: ProjectDetailsLeftSliderProps) {
  if (!project) return null

  return (
    <div
      className={cn(
        "fixed top-[70px] left-0 h-[calc(100vh-70px)] w-[400px] transform transition-transform ease-out-expo duration-500 z-40 bg-black/90 backdrop-blur-sm overflow-hidden",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all duration-300 border border-white/20"
        aria-label="Close project details"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>

      {/* Project header image */}
      <div className="relative w-full h-[200px]">
        <Image
          src={
            project.image || `https://source.unsplash.com/random/800x600?property,${encodeURIComponent(project.name)}`
          }
          alt={project.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

        {/* Project title */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-white text-2xl font-bold">{project.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <MapPin className="h-4 w-4 text-white/70" />
            <span className="text-white/70 text-sm">{project.location}</span>
          </div>
        </div>
      </div>

      {/* Project details */}
      <ScrollArea className="h-[calc(100%-200px)]">
        <div className="p-4 space-y-6">
          {/* Key details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="text-white/60 text-xs mb-1">Plots</div>
              <div className="text-white font-medium">{project.plots}</div>
            </div>

            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="text-white/60 text-xs mb-1">Type</div>
              <div className="text-white font-medium">{project.type}</div>
            </div>

            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="text-white/60 text-xs mb-1">Status</div>
              <div className={cn("font-medium", project.status === "sold out" ? "text-red-500" : "text-green-500")}>
                {project.status === "sold out" ? "Sold Out" : "Available"}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="text-white/60 text-xs mb-1">Handover</div>
              <div className="text-white font-medium">{project.handover || "2025"}</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-white font-medium mb-2">About {project.name}</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              {project.description ||
                `${project.name} is a premium ${project.type.toLowerCase()} development located in ${project.location}. Featuring ${project.plots} plots of exceptional quality, this project offers residents a unique living experience with world-class amenities and stunning views.`}
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-medium mb-2">Features & Amenities</h3>
            <ul className="grid grid-cols-2 gap-2">
              {(
                project.features || [
                  "Swimming Pool",
                  "Fitness Center",
                  "Children's Play Area",
                  "Landscaped Gardens",
                  "24/7 Security",
                  "Retail Outlets",
                ]
              ).map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-white/70 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Gallery */}
          <div>
            <h3 className="text-white font-medium mb-2">Gallery</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={`https://source.unsplash.com/random/400x400?property,${encodeURIComponent(project.name)},${item}`}
                    alt={`${project.name} gallery ${item}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-white font-medium mb-2">Location</h3>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-white/5 border border-white/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-white/30" />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-medium mb-2">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Phone className="h-4 w-4 text-cyan-400" />
                <span>+971 2 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Mail className="h-4 w-4 text-cyan-400" />
                <span>info@aldar.com</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Globe className="h-4 w-4 text-cyan-400" />
                <span>www.aldar.com</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          {project.status !== "sold out" && (
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
              Enquire Now
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
