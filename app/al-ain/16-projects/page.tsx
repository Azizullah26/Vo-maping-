"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { projects16, type Project16 } from "@/data/16-projects-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Clock, Building } from "lucide-react";

const statusColors = {
  completed: "bg-green-400 shadow-green-400/50",
  "in-progress": "bg-yellow-400 shadow-yellow-400/50",
  planned: "bg-blue-400 shadow-blue-400/50",
};

const statusLabels = {
  completed: "Completed",
  "in-progress": "In Progress",
  planned: "Planned",
};

const categoryIcons = {
  residential: "🏠",
  commercial: "🏢",
  infrastructure: "🏗️",
  public: "🏛️",
};

export default function SixteenProjectsPage() {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<Project16 | null>(
    null,
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = imageRef.current.getBoundingClientRect();
        setImageDimensions({
          width: imageRect.width,
          height: imageRect.height,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imageLoaded]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    if (imageRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();
      setImageDimensions({
        width: imageRect.width,
        height: imageRect.height,
      });
    }
  };

  const getMarkerPosition = (percentageCoords: [number, number]) => {
    if (!imageLoaded || !imageRef.current || !containerRef.current)
      return { left: 0, top: 0 };

    const imageRect = imageRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Calculate marker position using percentages
    const left =
      (percentageCoords[0] / 100) * imageRect.width +
      (imageRect.left - containerRect.left);
    const top =
      (percentageCoords[1] / 100) * imageRect.height +
      (imageRect.top - containerRect.top);

    return { left, top };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Floating Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-white hover:bg-black/50 bg-black/30 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="flex h-screen">
        {/* Main Map Area - Full Screen */}
        <div
          className="fixed inset-0 bg-gray-900 overflow-hidden text-white000"
          ref={containerRef}
        >
          <img
            ref={imageRef}
            src="/images/al-ain-16-projects-satellite.png"
            alt="Al Ain 16 Projects Satellite View"
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
          />

          {/* Futuristic Color Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-slate-900/10 pointer-events-none" />

          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: "50px 50px",
                animation: "gridMove 20s linear infinite",
              }}
            />
          </div>

          {/* Project Markers */}
          {imageLoaded &&
            projects16.map((project, index) => {
              const position = getMarkerPosition(project.percentageCoordinates);
              const isSelected = selectedProject?.id === project.id;
              return (
                <div
                  key={project.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                  style={{
                    left: `${position.left}px`,
                    top: `${position.top}px`,
                    animationDelay: `${index * 0.1}s`,
                  }}
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Outer Pulsing Ring */}
                  <div
                    className={`absolute inset-0 rounded-full animate-ping ${
                      isSelected ? "bg-cyan-400/30" : "bg-blue-400/20"
                    }`}
                    style={{
                      width: "24px",
                      height: "24px",
                      transform: "translate(-50%, -50%)",
                      top: "50%",
                      left: "50%",
                    }}
                  />

                  {/* Secondary Ring */}
                  <div
                    className={`absolute rounded-full transition-all duration-500 ${
                      isSelected
                        ? "bg-gradient-to-r from-cyan-400/40 to-blue-500/40 scale-150"
                        : "bg-gradient-to-r from-blue-400/30 to-purple-500/30 group-hover:scale-125"
                    }`}
                    style={{
                      width: "20px",
                      height: "20px",
                      transform: "translate(-50%, -50%)",
                      top: "50%",
                      left: "50%",
                    }}
                  />

                  {/* Main Marker Circle */}
                  <div
                    className={`
                      relative w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full border-2 transition-all duration-300 ease-out
                      ${
                        isSelected
                          ? "bg-gradient-to-br from-cyan-400 to-blue-600 border-cyan-300 scale-125 shadow-lg shadow-cyan-400/50"
                          : "bg-gradient-to-br from-blue-500 to-purple-600 border-blue-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-400/50"
                      }
                      shadow-2xl transform-gpu
                    `}
                    style={{
                      boxShadow: isSelected
                        ? "0 0 20px rgba(34, 211, 238, 0.6), 0 0 40px rgba(34, 211, 238, 0.3)"
                        : "0 0 15px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.2)",
                    }}
                  >
                    {/* Inner Animated Core */}
                    <div
                      className={`absolute inset-1 rounded-full transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-br from-cyan-200 to-blue-400 animate-pulse"
                          : "bg-gradient-to-br from-blue-200 to-purple-400 group-hover:animate-pulse"
                      }`}
                    />

                    {/* Center Dot */}
                    <div
                      className={`absolute inset-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                        isSelected
                          ? "bg-white animate-ping"
                          : "bg-white/80 group-hover:bg-white"
                      }`}
                    />
                  </div>

                  {/* Floating Project Number */}
                  <div
                    className={`absolute -top-7 sm:-top-9 md:-top-11 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                      isSelected
                        ? "bg-gradient-to-r from-cyan-600 to-blue-700 border-cyan-400 scale-110 shadow-lg shadow-cyan-400/30"
                        : "bg-gradient-to-r from-slate-800 to-blue-900 border-blue-400 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-400/30"
                    } text-white text-[10px] sm:text-xs md:text-sm font-bold px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full border-2 whitespace-nowrap backdrop-blur-sm`}
                  >
                    #{project.id.split("-")[1]}
                  </div>

                  {/* Status Indicator */}
                  <div
                    className={`absolute -bottom-2 sm:-bottom-3 md:-bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-white/50 transition-all duration-300 ${
                      project.status === "completed"
                        ? "bg-green-400 shadow-green-400/50"
                        : project.status === "in-progress"
                          ? "bg-yellow-400 shadow-yellow-400/50"
                          : "bg-gray-400 shadow-gray-400/50"
                    } animate-pulse`}
                  />

                  {/* Enhanced Hover Tooltip */}
                  <div className="absolute top-8 sm:top-10 md:top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-1 pointer-events-none z-30 hidden sm:block">
                    <div className="bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-purple-900/95 border-2 border-cyan-400/50 rounded-xl px-3 md:px-4 py-2 md:py-3 shadow-2xl shadow-cyan-400/20 backdrop-blur-md">
                      <div className="text-cyan-100 font-semibold text-xs md:text-sm whitespace-nowrap">
                        {project.name}
                      </div>
                      <div className="text-cyan-300/80 text-[10px] md:text-xs whitespace-nowrap">
                        {project.nameAr}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg">
                          {categoryIcons[project.category]}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium text-white ${
                            project.status === "completed"
                              ? "bg-green-500/80"
                              : project.status === "in-progress"
                                ? "bg-yellow-500/80"
                                : "bg-gray-500/80"
                          }`}
                        >
                          {statusLabels[project.status]}
                        </span>
                      </div>

                      {/* Tooltip Arrow */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-cyan-400/50"></div>
                    </div>
                  </div>

                  {/* Ripple Effect on Click */}
                  {isSelected && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping bg-cyan-400/20"
                      style={{
                        width: "40px",
                        height: "40px",
                        transform: "translate(-50%, -50%)",
                        top: "50%",
                        left: "50%",
                      }}
                    />
                  )}
                </div>
              );
            })}
        </div>

        {/* Mobile Bottom Sheet / Desktop Side Panel */}
        {selectedProject && (
          <>
            {/* Mobile Bottom Sheet */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-slate-900 via-blue-900/90 to-purple-900/90 border-t-2 border-cyan-400/50 rounded-t-2xl max-h-[50vh] overflow-y-auto backdrop-blur-md">
              <div className="p-4">
                {/* Handle bar */}
                <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto mb-4 shadow-lg shadow-cyan-400/30"></div>

                <Card className="bg-gradient-to-br from-slate-800/80 to-blue-900/80 border-2 border-cyan-400/30 shadow-lg shadow-cyan-400/20 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text flex items-center gap-2 text-lg font-bold">
                      <span>{categoryIcons[selectedProject.category]}</span>
                      {selectedProject.name}
                    </CardTitle>
                    <p className="text-cyan-300 text-sm">
                      {selectedProject.nameAr}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span
                        className={`px-3 py-1 rounded-full text-xs text-white border transition-all duration-300 ${
                          selectedProject.status === "completed"
                            ? "bg-green-500/80 border-green-400 shadow-green-400/30"
                            : selectedProject.status === "in-progress"
                              ? "bg-yellow-500/80 border-yellow-400 shadow-yellow-400/30"
                              : "bg-gray-500/80 border-gray-400 shadow-gray-400/30"
                        } shadow-lg`}
                      >
                        {statusLabels[selectedProject.status]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-purple-400" />
                      <span className="capitalize text-sm text-cyan-100">
                        {selectedProject.category}
                      </span>
                    </div>

                    <p className="text-cyan-200 text-sm leading-relaxed">
                      {selectedProject.description}
                    </p>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProject(null)}
                        className="flex-1 bg-gradient-to-r from-slate-700 to-gray-800 border-slate-500 text-cyan-100 hover:from-slate-600 hover:to-gray-700 hover:shadow-lg hover:shadow-slate-400/30 transition-all duration-300"
                      >
                        Close
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          router.push(
                            `/dashboard/${selectedProject.id}?name=${encodeURIComponent(selectedProject.name)}&nameAr=${encodeURIComponent(selectedProject.nameAr)}`,
                          );
                        }}
                        className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/30 transition-all duration-300"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Desktop Side Panel */}
            <div className="hidden md:block w-96 bg-gradient-to-b from-slate-900 via-blue-900/90 to-purple-900/90 border-l-2 border-cyan-400/50 overflow-y-auto backdrop-blur-md">
              <div className="p-6">
                <Card className="bg-gradient-to-br from-slate-800/80 to-blue-900/80 border-2 border-cyan-400/30 shadow-xl shadow-cyan-400/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text flex items-center gap-2 font-bold">
                      <span>{categoryIcons[selectedProject.category]}</span>
                      {selectedProject.name}
                    </CardTitle>
                    <p className="text-cyan-300">{selectedProject.nameAr}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span
                        className={`px-3 py-1 rounded-full text-xs text-white border transition-all duration-300 ${
                          selectedProject.status === "completed"
                            ? "bg-green-500/80 border-green-400 shadow-green-400/30"
                            : selectedProject.status === "in-progress"
                              ? "bg-yellow-500/80 border-yellow-400 shadow-yellow-400/30"
                              : "bg-gray-500/80 border-gray-400 shadow-gray-400/30"
                        } shadow-lg`}
                      >
                        {statusLabels[selectedProject.status]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-purple-400" />
                      <span className="capitalize text-cyan-100">
                        {selectedProject.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-cyan-200">
                        Position:{" "}
                        {selectedProject.percentageCoordinates[0].toFixed(1)}%,{" "}
                        {selectedProject.percentageCoordinates[1].toFixed(1)}%
                      </span>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-400/20">
                      <p className="text-cyan-200 leading-relaxed">
                        {selectedProject.description}
                      </p>
                    </div>

                    <Button
                      className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 border border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/30 transition-all duration-300 text-white font-medium"
                      onClick={() => {
                        router.push(
                          `/dashboard/${selectedProject.id}?name=${encodeURIComponent(selectedProject.name)}&nameAr=${encodeURIComponent(selectedProject.nameAr)}`,
                        );
                      }}
                    >
                      View Project Details
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
