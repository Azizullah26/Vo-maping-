"use client"

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import type { JSX } from "react";
import { useRouter } from "next/navigation";

export const Map = (): JSX.Element => {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [showSliders, setShowSliders] = useState(true);
  const [slidersPosition, setSlidersPosition] = useState("center");
  const router = useRouter();

  const [zoomLevel, setZoomLevel] = useState(0.4); // Start with 40% zoom fixed on full screen
  const [mapTransform, setMapTransform] = useState({
    scale: 0.4,
    translateX: 0,
    translateY: 0,
  });
  const [isZooming, setIsZooming] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Smooth zoom implementation with wheel support
  const handleWheelZoom = useCallback((event: WheelEvent) => {
    event.preventDefault();
    setIsZooming(true);

    const zoomSpeed = 0.1;
    const delta = event.deltaY > 0 ? -zoomSpeed : zoomSpeed;

    setZoomLevel((prev) => {
      const newZoom = Math.max(0.2, Math.min(prev + delta, 3)); // Space view (0.2) to close view (3)
      return newZoom;
    });

    // Clear zooming state after a delay
    setTimeout(() => setIsZooming(false), 150);
  }, []);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.15, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.15, 0.2));
  };

  const handleResetZoom = () => {
    setZoomLevel(0.4); // Reset to 40% zoom fixed view
    // Reset to initial centered position
    if (mapContainerRef.current) {
      const mapWidth = 2370;
      const mapHeight = 2370;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Center the map image perfectly in the viewport at 40% zoom
      const scaledMapWidth = mapWidth * 0.4;
      const scaledMapHeight = mapHeight * 0.4;

      const centerX = Math.max(0, (scaledMapWidth - viewportWidth) / 2);
      const centerY = Math.max(0, (scaledMapHeight - viewportHeight) / 2);

      window.scrollTo({
        left: centerX,
        top: centerY,
        behavior: "smooth",
      });
    }
  };

  // Fullscreen functionality
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'f' || event.key === 'F') {
        toggleFullscreen();
      } else if (event.key === '+' || event.key === '=') {
        handleZoomIn();
      } else if (event.key === '-') {
        handleZoomOut();
      } else if (event.key === '0') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleFullscreen]);

  useEffect(() => {
    // Center the map when component loads - show centered view at 40%
    if (mapContainerRef.current) {
      // Calculate center position for 40% zoom view
      const mapWidth = 2370;
      const mapHeight = 2370;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Center the map image perfectly in the viewport
      const scaledMapWidth = mapWidth * 0.4;
      const scaledMapHeight = mapHeight * 0.4;

      // Calculate center position to show the map centered on the page
      const centerX = Math.max(0, (scaledMapWidth - viewportWidth) / 2);
      const centerY = Math.max(0, (scaledMapHeight - viewportHeight) / 2);

      // Set initial scroll position for centered view
      window.scrollTo({
        left: centerX,
        top: centerY,
        behavior: "smooth",
      });
    }

    // Add wheel event listener for smooth zoom
    const mapContainer = mapContainerRef.current;
    if (mapContainer) {
      mapContainer.addEventListener("wheel", handleWheelZoom, {
        passive: false,
      });
      return () => {
        mapContainer.removeEventListener("wheel", handleWheelZoom);
      };
    }
  }, [handleWheelZoom]);

  useEffect(() => {
    // Add wave animation styles to the document
    if (!document.getElementById("wave-animations")) {
      const styleElement = document.createElement("style");
      styleElement.id = "wave-animations";
      styleElement.innerHTML = \`
@keyframes waterWave {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  25% {
    transform: scale(1.3);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.6);
    opacity: 0.4;
  }
  75% {
    transform: scale(1.9);
    opacity: 0.2;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}

@keyframes rippleWave {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  30% {
    transform: scale(1.4);
    opacity: 0.7;
  }
  60% {
    transform: scale(1.8);
    opacity: 0.3;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

.wave-circle {
  position: relative;
  overflow: visible;
}

.wave-circle::before,
.wave-circle::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: waterWave 3s infinite ease-out;
  pointer-events: none;
}

.wave-circle::after {
  animation: rippleWave 3s infinite ease-out;
  animation-delay: 1.5s;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
\`;
      document.head.appendChild(styleElement);

      return () => {
        const element = document.getElementById("wave-animations");
        if (element) {
          element.remove();
        }
      };
    }
  }, []);

  const handleLabelHover = (labelId: string | null) => {
    setHoveredLabel(labelId);
  };

  const getElementOpacity = (elementId?: string) => {
    if (!hoveredLabel) return "opacity-100";
    return hoveredLabel === elementId ? "opacity-100" : "opacity-30";
  };

  const getElementScale = (elementId?: string) => {
    if (!hoveredLabel) return "scale-100";
    return hoveredLabel === elementId ? "scale-110" : "scale-95";
  };

  const getElementBrightness = () => {
    return hoveredLabel ? "brightness-75" : "brightness-100";
  };

  const getLabelClasses = (labelId: string) => {
    const baseClasses =
      "group flex items-center justify-center px-3 py-2 bg-white hover:bg-black rounded-full border-2 border-solid transition-all duration-300 cursor-pointer font-sans font-medium";
    const isHovered = hoveredLabel === labelId;

    if (isHovered) {
      return \`\${baseClasses} shadow-lg shadow-blue-500/50 ring-2 ring-blue-400 z-50 scale-110\`;
    }

    return \`\${baseClasses} \${getElementOpacity(labelId)} \${getElementScale(labelId)}\`;
  };

  const getTextClasses = () => {
    return "text-black group-hover:text-white tracking-normal leading-snug whitespace-nowrap overflow-hidden text-ellipsis font-sans font-semibold antialiased";
  };

  const getDotClasses = (elementId?: string) => {
    return \`flex w-[26px] h-[26px] items-center justify-center gap-[2.83px] p-[4.24px] absolute bg-[#ffffff1a] rounded-[13px] transition-all duration-300 \${getElementOpacity(elementId)} \${getElementScale(elementId)}\`;
  };

  const getVectorClasses = (elementId?: string) => {
    return \`absolute transition-all duration-300 \${getElementOpacity(elementId)} \${getElementScale(elementId)}\`;
  };

  return (
    <div
      className="w-full h-screen overflow-auto relative"
      style={{
        background:
          zoomLevel < 0.5
            ? 'radial-gradient(ellipse at center, #0f1419 0%, #000000 70%), url("data:image/svg+xml,%3csvg width=\\'60\\' height=\\'60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3e%3cdefs%3e%3cpattern id=\\'star\\' x=\\'0\\' y=\\'0\\' width=\\'60\\' height=\\'60\\' patternUnits=\\'userSpaceOnUse\\'%3e%3ccircle cx=\\'5\\' cy=\\'5\\' r=\\'0.5\\' fill=\\'%23ffffff\\' opacity=\\'0.8\\'/%3e%3ccircle cx=\\'25\\' cy=\\'15\\' r=\\'0.3\\' fill=\\'%23ffffff\\' opacity=\\'0.6\\'/%3e%3ccircle cx=\\'45\\' cy=\\'8\\' r=\\'0.4\\' fill=\\'%23ffffff\\' opacity=\\'0.7\\'/%3e%3ccircle cx=\\'15\\' cy=\\'35\\' r=\\'0.2\\' fill=\\'%23ffffff\\' opacity=\\'0.5\\'/%3e%3ccircle cx=\\'55\\' cy=\\'45\\' r=\\'0.6\\' fill=\\'%23ffffff\\' opacity=\\'0.9\\'/%3e%3ccircle cx=\\'35\\' cy=\\'50\\' r=\\'0.3\\' fill=\\'%23ffffff\\' opacity=\\'0.6\\'/%3e%3c/pattern%3e%3c/defs%3e%3crect width=\\'60\\' height=\\'60\\' fill=\\'url(%23star)\\'/%3e%3c/svg%3e")'
            : "#000000",
      }}
    >
      <div
        ref={mapContainerRef}
        className="relative w-[2370px] h-[2370px] bg-cover bg-center min-w-[2370px] overflow-visible"
        style={{
          backgroundImage: "url('/images/abu-dhabi-satellite-map.jpg')",
          backgroundSize: "2370px 2370px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          transform: \`scale(\${zoomLevel})\`,
          transformOrigin: "center center",
          transition: isZooming
            ? "transform 0.1s ease-out"
            : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          filter:
            zoomLevel < 0.6
              ? \`brightness(0.9) contrast(1.1) saturate(1.2)\`
              : "none", // Space-like effect
        }}
      >
        <div className={\`w-full h-full transition-all duration-300 \${getElementBrightness()}\`}>
          {/* Hospital markers */}
          <Button
            onClick={() =>
              router.push(
                \`/dashboard/abu-dhabi-hospital-1?name=\${encodeURIComponent("Hospital - Location 1")}&nameAr=\${encodeURIComponent("مستشفى - الموقع 1")}\`,
              )
            }
            onMouseEnter={() => handleLabelHover("hospital-1")}
            onMouseLeave={() => handleLabelHover(null)}
            className={\`flex flex-col w-[50px] h-[50px] items-center justify-center gap-[7.58px] p-[11.36px] absolute top-[1103px] left-[1347px] bg-[#252525cc] hover:bg-[#1a1a1acc] rounded-[25px] transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 \${getElementOpacity("hospital-1")} \${getElementScale("hospital-1")}\`}
          >
            <Image
              className="relative w-[27.27px] h-[27.27px] transition-all duration-300 group-hover:brightness-110"
              alt="Hospital"
              src="/hospital-icons.svg"
              width={27.27}
              height={27.27}
            />
          </Button>

          <Button
            onClick={() =>
              router.push(
                \`/dashboard/abu-dhabi-hospital-2?name=\${encodeURIComponent("Hospital - Location 2")}&nameAr=\${encodeURIComponent("مستشفى - الموقع 2")}\`,
              )
            }
            onMouseEnter={() => handleLabelHover("hospital-2")}
            onMouseLeave={() => handleLabelHover(null)}
            className={\`flex flex-col w-[50px] h-[50px] items-center justify-center gap-[7.58px] p-[11.36px] absolute top-[978px] left-[1095px] bg-[#252525cc] hover:bg-[#1a1a1acc] rounded-[25px] transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 \${getElementOpacity("hospital-2")} \${getElementScale("hospital-2")}\`}
          >
            <Image
              className="relative w-[27.27px] h-[27.27px] transition-all duration-300 group-hover:brightness-110"
              alt="Hospital"
              src="/hospital-icons.svg"
              width={27.27}
              height={27.27}
            />
          </Button>

          {/* Police station markers */}
          <Button
            onClick={() =>
              router.push(
                \`/dashboard/abu-dhabi-police-1?name=\${encodeURIComponent("Police Station - Location 1")}&nameAr=\${encodeURIComponent("مركز الشرطة - الموقع 1")}\`,
              )
            }
            onMouseEnter={() => handleLabelHover("police-1")}
            onMouseLeave={() => handleLabelHover(null)}
            className={\`absolute w-[60px] h-[60px] top-[1118px] left-[1068px] transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 rounded-full \${getElementOpacity("police-1")} \${getElementScale("police-1")}\`}
          >
            <Image
              className="w-full h-full transition-all duration-300 hover:brightness-110"
              alt="Police station"
              src="/police-icons.svg"
              width={60}
              height={60}
            />
          </Button>

          <Button
            onClick={() =>
              router.push(
                \`/dashboard/abu-dhabi-police-2?name=\${encodeURIComponent("Police Station - Location 2")}&nameAr=\${encodeURIComponent("مركز الشرطة - الموقع 2")}\`,
              )
            }
            onMouseEnter={() => handleLabelHover("police-2")}
            onMouseLeave={() => handleLabelHover(null)}
            className={\`absolute w-[60px] h-[60px] top-[1178px] left-[1178px] transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 rounded-full \${getElementOpacity("police-2")} \${getElementScale("police-2")}\`}
          >
            <Image
              className="w-full h-full transition-all duration-300 hover:brightness-110"
              alt="Police station"
              src="/police-icons.svg"
              width={60}
              height={60}
            />
          </Button>

          {/* Marker 1 - Al Aliah */}
          <div
            className={\`absolute w-[69px] h-[68px] top-[589px] left-[1134px] transition-all duration-300 \${getElementOpacity("urgent-point-al-aliah")} \${getElementScale("urgent-point-al-aliah")}\`}
          >
            <div className={\`\${getDotClasses("urgent-point-al-aliah")} top-[42px] left-0\`}>
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={\`\${getVectorClasses("urgent-point-al-aliah")} w-14 h-14 top-0 left-[13px]\`}
              alt="Vector"
              src="/vector-21.svg"
              width={14}
              height={14}
            />
          </div>

          {/* All standalone label buttons */}
          <Button
            onClick={() =>
              router.push(
                \`/dashboard/abu-dhabi-urgent-point-al-aliah?name=\${encodeURIComponent("Urgent Point - Al Aliah")}&nameAr=\${encodeURIComponent("نقطة عاجلة - العالية")}\`,
              )
            }
            onMouseEnter={() => handleLabelHover("urgent-point-al-aliah")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("urgent-point-al-aliah")}
            style={{ width: "164px", height: "26px", position: "absolute", top: "562px", left: "1190px" }}
          >
            <span className={\`text-[14px] \${getTextClasses()}\`}>Urgent Point - Al Aliah</span>
          </Button>
        </div>
      </div>

      {/* Centered Control Sliders */}
      {showSliders && (
        <div className="fixed inset-0 pointer-events-none z-40">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 shadow-2xl border border-white/20">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white text-sm">
                      Abu Dhabi Interactive Map - Mouse wheel to zoom | Keys: F (fullscreen), +/- (zoom), 0 (reset)
                    </div>
                    <div className="text-white text-xs opacity-80 mt-1">
                      Zoom: {Math.round(zoomLevel * 100)}% |{" "}
                      {zoomLevel < 0.5
                        ? "🛰️ Space View"
                        : zoomLevel < 1
                          ? "✈️ Aerial View"
                          : "🏙️ City View"}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSliders(false)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                  >
                    Hide Controls
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleZoomOut}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                  >
                    Zoom Out (-)
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                  >
                    Fixed View (0)
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                  >
                    Zoom In (+)
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
                  >
                    {isFullscreen ? 'Exit' : 'Fullscreen'} (F)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show Controls Button */}
      {!showSliders && (
        <button
          onClick={() => setShowSliders(true)}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-lg"
        >
          Show Controls
        </button>
      )}
    </div>
  );
};

export default Map;