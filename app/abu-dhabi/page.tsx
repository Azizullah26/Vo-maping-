"use client";

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
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const abuDhabiCenterX = 1185;
      const abuDhabiCenterY = 950;
      const centerX = Math.max(0, abuDhabiCenterX - (viewportWidth * 0.7) / 2);
      const centerY = Math.max(0, abuDhabiCenterY - (viewportHeight * 0.7) / 2);

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
      if (event.key === "f" || event.key === "F") {
        toggleFullscreen();
      } else if (event.key === "+" || event.key === "=") {
        handleZoomIn();
      } else if (event.key === "-") {
        handleZoomOut();
      } else if (event.key === "0") {
        handleResetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [toggleFullscreen]);

  useEffect(() => {
    // Center the map when component loads - show space-like view
    if (mapContainerRef.current) {
      // Calculate center position for space-like view
      const mapWidth = 2370;
      const mapHeight = 2370;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Center for space-like view - show entire Abu Dhabi region from space
      const abuDhabiCenterX = 1185;
      const abuDhabiCenterY = 950;

      // For 40% zoom view, center the entire map in viewport for full screen
      const centerX = Math.max(0, (mapWidth * 0.4 - viewportWidth) / 2);
      const centerY = Math.max(0, (mapHeight * 0.4 - viewportHeight) / 2);

      // Set initial scroll position for space-like view
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
      styleElement.innerHTML = `
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
`;
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
      return `${baseClasses} shadow-lg shadow-blue-500/50 ring-2 ring-blue-400 z-50 scale-110`;
    }

    return `${baseClasses} ${getElementOpacity(labelId)} ${getElementScale(labelId)}`;
  };

  const getTextClasses = () => {
    return "text-black group-hover:text-white tracking-normal leading-snug whitespace-nowrap overflow-hidden text-ellipsis font-sans font-semibold antialiased";
  };

  const getDotClasses = (elementId?: string) => {
    return `flex w-[26px] h-[26px] items-center justify-center gap-[2.83px] p-[4.24px] absolute bg-[#ffffff1a] rounded-[13px] transition-all duration-300 ${getElementOpacity(elementId)} ${getElementScale(elementId)}`;
  };

  const getVectorClasses = (elementId?: string) => {
    return `absolute transition-all duration-300 ${getElementOpacity(elementId)} ${getElementScale(elementId)}`;
  };

  return (
    <div
      className="w-full h-screen overflow-auto relative"
      style={{
        background:
          zoomLevel < 0.5
            ? "radial-gradient(ellipse at center, #0f1419 0%, #000000 70%), url(\"data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='star' x='0' y='0' width='60' height='60' patternUnits='userSpaceOnUse'%3e%3ccircle cx='5' cy='5' r='0.5' fill='%23ffffff' opacity='0.8'/%3e%3ccircle cx='25' cy='15' r='0.3' fill='%23ffffff' opacity='0.6'/%3e%3ccircle cx='45' cy='8' r='0.4' fill='%23ffffff' opacity='0.7'/%3e%3ccircle cx='15' cy='35' r='0.2' fill='%23ffffff' opacity='0.5'/%3e%3ccircle cx='55' cy='45' r='0.6' fill='%23ffffff' opacity='0.9'/%3e%3ccircle cx='35' cy='50' r='0.3' fill='%23ffffff' opacity='0.6'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='60' height='60' fill='url(%23star)'/%3e%3c/svg%3e\")"
            : "#000000",
      }}
    >
      <div
        ref={mapContainerRef}
        className="relative w-[2370px] h-[2370px] bg-cover bg-center min-w-[2370px] overflow-visible mx-auto"
        style={{
          backgroundImage: "url('/images/abu-dhabi-satellite-map.jpg')",
          backgroundSize: "2370px 2370px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          transform: `scale(${zoomLevel})`,
          transformOrigin: "center center",
          transition: isZooming
            ? "transform 0.1s ease-out"
            : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          filter:
            zoomLevel < 0.6
              ? `brightness(0.9) contrast(1.1) saturate(1.2)`
              : "none", // Space-like effect
        }}
      >
        <div
          className={`w-full h-full transition-all duration-300 ${getElementBrightness()}`}
        >
          {/* Hospital markers */}
          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-hospital-1?name=${encodeURIComponent("Hospital - Location 1")}&nameAr=${encodeURIComponent("مستشفى - الموقع 1")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("hospital-1")}
            onMouseLeave={() => handleLabelHover(null)}
            className={`flex flex-col w-[50px] h-[50px] items-center justify-center gap-[7.58px] p-[11.36px] absolute top-[1103px] left-[1347px] bg-[#252525cc] hover:bg-[#1a1a1acc] rounded-[25px] transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 ${getElementOpacity("hospital-1")} ${getElementScale("hospital-1")}`}
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
                `/dashboard/abu-dhabi-hospital-2?name=${encodeURIComponent("Hospital - Location 2")}&nameAr=${encodeURIComponent("مستشفى - الموقع 2")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("hospital-2")}
            onMouseLeave={() => handleLabelHover(null)}
            className={`flex flex-col w-[50px] h-[50px] items-center justify-center gap-[7.58px] p-[11.36px] absolute top-[978px] left-[1095px] bg-[#252525cc] hover:bg-[#1a1a1acc] rounded-[25px] transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 ${getElementOpacity("hospital-2")} ${getElementScale("hospital-2")}`}
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
                `/dashboard/abu-dhabi-police-1?name=${encodeURIComponent("Police Station - Location 1")}&nameAr=${encodeURIComponent("مركز الشرطة - الموقع 1")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("police-1")}
            onMouseLeave={() => handleLabelHover(null)}
            className={`absolute w-[60px] h-[60px] top-[1118px] left-[1068px] transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 rounded-full ${getElementOpacity("police-1")} ${getElementScale("police-1")}`}
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
                `/dashboard/abu-dhabi-police-2?name=${encodeURIComponent("Police Station - Location 2")}&nameAr=${encodeURIComponent("مركز الشرطة - الموقع 2")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("police-2")}
            onMouseLeave={() => handleLabelHover(null)}
            className={`absolute w-[60px] h-[60px] top-[1178px] left-[1178px] transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 rounded-full ${getElementOpacity("police-2")} ${getElementScale("police-2")}`}
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
            className={`absolute w-[69px] h-[68px] top-[589px] left-[1134px] transition-all duration-300 ${getElementOpacity("urgent-point-al-aliah")} ${getElementScale("urgent-point-al-aliah")}`}
          >
            <div
              className={`${getDotClasses("urgent-point-al-aliah")} top-[42px] left-0`}
            >
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses("urgent-point-al-aliah")} w-14 h-14 top-0 left-[13px]`}
              alt="Vector"
              src="/vector-21.svg"
              width={14}
              height={14}
            />
          </div>

          {/* Marker 2 - Al Nahdha */}
          <div
            className={`absolute w-[51px] h-[39px] top-[1502px] left-[1328px] transition-all duration-300 ${getElementOpacity("urgent-point-al-nahdha")} ${getElementScale("urgent-point-al-nahdha")}`}
          >
            <div
              className={`${getDotClasses("urgent-point-al-nahdha")} top-[13px] left-[25px]`}
            >
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses("urgent-point-al-nahdha")} w-[37px] h-[26px] top-0 left-0`}
              alt="Vector"
              src="/vector-35.svg"
              width={37}
              height={26}
            />
          </div>

          {/* Marker 3 - Shooting Range */}
          <div
            className={`absolute w-[51px] h-[39px] top-[1753px] left-[2015px] transition-all duration-300 ${getElementOpacity("shooting-range-ad-police-rcc")} ${getElementScale("shooting-range-ad-police-rcc")}`}
          >
            <div
              className={`${getDotClasses("shooting-range-ad-police-rcc")} top-[13px] left-[25px]`}
            >
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses("shooting-range-ad-police-rcc")} w-[37px] h-[26px] top-0 left-0`}
              alt="Vector"
              src="/vector-35.svg"
              width={37}
              height={26}
            />
          </div>

          {/* Complex marker group - Urgent Points Al Riyad & Rabdan 2 + NGC MBZ */}
          <div
            className={`absolute w-[411px] h-[121px] top-[1248px] left-[1048px] transition-all duration-300 ${getElementOpacity("urgent-point-al-riyad")} ${getElementScale("urgent-point-al-riyad")}`}
          >
            <div className="absolute w-[332px] h-[92px] top-[23px] left-[62px]">
              {/* Urgent Point - Al Riyad */}
              <div className="absolute w-[216px] h-12 top-11 left-[116px]">
                <div
                  className={`${getDotClasses("urgent-point-al-riyad")} top-[22px] left-[190px]`}
                >
                  <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
                </div>
                <Image
                  className={`${getVectorClasses("urgent-point-al-riyad")} w-[38px] h-[17px] top-[17px] left-[163px]`}
                  alt="Vector"
                  src="/vector-24.svg"
                  width={38}
                  height={17}
                />
                <Button
                  onClick={() =>
                    router.push(
                      `/dashboard/abu-dhabi-urgent-point-al-riyad?name=${encodeURIComponent("Urgent Point - Al Riyad")}&nameAr=${encodeURIComponent("نقطة عاجلة - الرياض")}`,
                    )
                  }
                  onMouseEnter={() => handleLabelHover("urgent-point-al-riyad")}
                  onMouseLeave={() => handleLabelHover(null)}
                  className={getLabelClasses("urgent-point-al-riyad")}
                  style={{
                    width: "163px",
                    height: "26px",
                    position: "absolute",
                    top: "0",
                    left: "0",
                  }}
                >
                  <span className={`text-[14px] ${getTextClasses()}`}>
                    Urgent Point - Al Riyad
                  </span>
                </Button>
              </div>

              {/* Urgent Point - Rabdan 2 */}
              <div className="absolute w-[187px] h-[54px] top-0 left-0">
                <div
                  className={`${getDotClasses("urgent-point-rabdan-2")} top-7 left-0`}
                >
                  <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
                </div>
                <Image
                  className={`${getVectorClasses("urgent-point-rabdan-2")} w-5 h-[17px] top-6 left-[11px]`}
                  alt="Vector"
                  src="/vector-26.svg"
                  width={5}
                  height={17}
                />
                <Button
                  onClick={() =>
                    router.push(
                      `/dashboard/abu-dhabi-urgent-point-rabdan-2?name=${encodeURIComponent("Urgent Point - Rabdan 2")}&nameAr=${encodeURIComponent("نقطة عاجلة - ربدان 2")}`,
                    )
                  }
                  onMouseEnter={() => handleLabelHover("urgent-point-rabdan-2")}
                  onMouseLeave={() => handleLabelHover(null)}
                  className={getLabelClasses("urgent-point-rabdan-2")}
                  style={{
                    width: "163px",
                    height: "26px",
                    position: "absolute",
                    top: "0",
                    left: "24",
                  }}
                >
                  <span className={`text-[14px] ${getTextClasses()}`}>
                    Urgent Point - Rabdan 2
                  </span>
                </Button>
              </div>
            </div>

            {/* NGC MBZ Ambulance */}
            <div className="absolute w-[50px] h-[49px] top-0 left-[361px]">
              <div
                className={`${getDotClasses("ngc-mbz-ambulance")} top-[23px] left-6`}
              >
                <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
              </div>
              <Image
                className={`${getVectorClasses("ngc-mbz-ambulance")} w-[35px] h-[35px] top-0 left-0`}
                alt="Vector"
                src="/vector-31.svg"
                width={35}
                height={35}
              />
            </div>

            <Button
              onClick={() =>
                router.push(
                  `/dashboard/abu-dhabi-ngc-mbz-ambulance?name=${encodeURIComponent("NGC MBZ Ambulance")}&nameAr=${encodeURIComponent("إسعاف مركز الإدارة البيئية")}`,
                )
              }
              onMouseEnter={() => handleLabelHover("ngc-mbz-ambulance")}
              onMouseLeave={() => handleLabelHover(null)}
              className={getLabelClasses("ngc-mbz-ambulance")}
              style={{
                width: "163px",
                height: "26px",
                position: "absolute",
                top: "95px",
                left: "0",
              }}
            >
              <span className={`text-[14px] ${getTextClasses()}`}>
                NGC MBZ Ambulance
              </span>
            </Button>
          </div>

          {/* Shakboot Civil Defense */}
          <div
            className={`absolute w-[35px] h-11 top-[1381px] left-[1466px] transition-all duration-300 ${getElementOpacity("shakboot-civil-defense")} ${getElementScale("shakboot-civil-defense")}`}
          >
            <div
              className={`${getDotClasses("shakboot-civil-defense")} top-[18px] left-0`}
            >
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses("shakboot-civil-defense")} w-[21px] h-[30px] top-0 left-3.5`}
              alt="Vector"
              src="/vector-43.svg"
              width={21}
              height={30}
            />
          </div>

          {/* NGC Abu Dhabi Airport */}
          <div
            className={`absolute w-[26px] h-[55px] top-[1369px] left-[1152px] transition-all duration-300 ${getElementOpacity("ngc-abu-dhabi-airport")} ${getElementScale("ngc-abu-dhabi-airport")}`}
          >
            <div
              className={`${getDotClasses("ngc-abu-dhabi-airport")} top-[29px] left-0`}
            >
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses("ngc-abu-dhabi-airport")} w-1.5 h-[42px] top-0 left-2.5`}
              alt="Vector"
              src="/vector-32.svg"
              width={1.5}
              height={42}
            />
          </div>

          {/* Police Center Musaffah */}
          <div
            className={`absolute w-12 h-[49px] top-[1427px] left-[1103px] transition-all duration-300 ${getElementOpacity("police-center-musaffah")} ${getElementScale("police-center-musaffah")}`}
          >
            <div
              className={`${getDotClasses("police-center-musaffah")} top-[23px] left-[22px]`}
            >
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses("police-center-musaffah")} w-[35px] h-9 top-0 left-0`}
              alt="Vector"
              src="/vector-36.svg"
              width={35}
              height={9}
            />
          </div>

          {/* Rebdan Police Points & Disciplinary Department Complex */}
          <div
            className={`absolute w-[235px] h-[132px] top-[1208px] left-[814px] transition-all duration-300 ${getElementOpacity("rebdan-police-points")} ${getElementScale("rebdan-police-points")}`}
          >
            <div className="absolute w-[195px] h-[82px] top-[51px] left-10">
              <div className="absolute w-[26px] h-11 top-0 left-[169px]">
                <div
                  className={`${getDotClasses("rebdan-police-points")} top-[18px] left-0`}
                >
                  <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
                </div>
                <Image
                  className={`${getVectorClasses("rebdan-police-points")} w-1.5 h-8 top-0 left-[11px]`}
                  alt="Vector"
                  src="/vector-27.svg"
                  width={1.5}
                  height={8}
                />
              </div>

              <div className="absolute w-[195px] h-[52px] top-[30px] left-0">
                <div
                  className={`${getDotClasses("rebdan-police-points")} top-[26px] left-[169px]`}
                >
                  <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
                </div>
                <Image
                  className={`${getVectorClasses("rebdan-police-points")} w-[35px] h-[17px] top-[23px] left-[148px]`}
                  alt="Vector"
                  src="/vector-42.svg"
                  width={35}
                  height={17}
                />
                <Button
                  onClick={() =>
                    router.push(
                      `/dashboard/abu-dhabi-rebdan-police-points?name=${encodeURIComponent("Rebdan Police Points")}&nameAr=${encodeURIComponent("نقاط شرطة ربدان")}`,
                    )
                  }
                  onMouseEnter={() => handleLabelHover("rebdan-police-points")}
                  onMouseLeave={() => handleLabelHover(null)}
                  className={getLabelClasses("rebdan-police-points")}
                  style={{
                    width: "150px",
                    height: "29px",
                    position: "absolute",
                    top: "0",
                    left: "0",
                  }}
                >
                  <span className={`text-[14px] ${getTextClasses()}`}>
                    Rebdan Police Points
                  </span>
                </Button>
              </div>
            </div>

            <div className="absolute w-[139px] h-[65px] top-0 left-0">
              <div
                className={`${getDotClasses("disciplinary-department")} top-[39px] left-[57px]`}
              >
                <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
              </div>
              <Image
                className={`${getVectorClasses("disciplinary-department")} w-1.5 h-[30px] top-[21px] left-[68px]`}
                alt="Vector"
                src="/vector-30.svg"
                width={1.5}
                height={30}
              />
              <Button
                onClick={() =>
                  router.push(
                    `/dashboard/abu-dhabi-disciplinary-department?name=${encodeURIComponent("Disciplinary Department")}&nameAr=${encodeURIComponent("قسم التأديب")}`,
                  )
                }
                onMouseEnter={() => handleLabelHover("disciplinary-department")}
                onMouseLeave={() => handleLabelHover(null)}
                className={getLabelClasses("disciplinary-department")}
                style={{
                  width: "139px",
                  height: "22px",
                  position: "absolute",
                  top: "0",
                  left: "0",
                }}
              >
                <span className={`text-[13px] ${getTextClasses()}`}>
                  Disciplinary Department
                </span>
              </Button>
            </div>
          </div>

          {/* Special Task Sector */}
          <div
            onMouseEnter={() => handleLabelHover("special-task-sector")}
            onMouseLeave={() => handleLabelHover(null)}
            className={`absolute w-[26px] h-[81px] top-[991px] left-[670px] transition-all duration-300 cursor-pointer ${getElementOpacity("special-task-sector")} ${getElementScale("special-task-sector")}`}
          >
            <div
              className={`${getDotClasses("special-task-sector")} top-[55px] left-0`}
            >
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses("special-task-sector")} w-1.5 h-[65px] top-0 left-[11px]`}
              alt="Vector"
              src="/vector-29.svg"
              width={1.5}
              height={65}
            />
          </div>

          {/* Clinics - Al Bateen */}
          <div
            className={`absolute w-[180px] h-24 top-[1044px] left-[488px] transition-all duration-300 ${getElementOpacity("clinics-al-bateen")} ${getElementScale("clinics-al-bateen")}`}
          >
            <div
              className={`${getDotClasses("clinics-al-bateen")} top-[70px] left-[154px]`}
            >
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses("clinics-al-bateen")} w-[30px] h-[60px] top-[23px] left-[137px]`}
              alt="Vector"
              src="/vector-48.svg"
              width={30}
              height={60}
            />
            <Button
              onClick={() =>
                router.push(
                  `/dashboard/abu-dhabi-clinics-al-bateen?name=${encodeURIComponent("Clinics - Al Bateen")}&nameAr=${encodeURIComponent("عيا��ات - البطين")}`,
                )
              }
              onMouseEnter={() => handleLabelHover("clinics-al-bateen")}
              onMouseLeave={() => handleLabelHover(null)}
              className={getLabelClasses("clinics-al-bateen")}
              style={{
                width: "141px",
                height: "28px",
                position: "absolute",
                top: "0",
                left: "0",
              }}
            >
              <span className={`text-[14px] ${getTextClasses()}`}>
                Clinics - Al Bateen
              </span>
            </Button>
          </div>

          {/* Al Mushrif Children Speciality Centre */}
          <div
            className={`absolute w-[68px] h-12 top-[1162px] left-[734px] transition-all duration-300 ${getElementOpacity("al-mushrif-children")} ${getElementScale("al-mushrif-children")}`}
          >
            <div
              className={`${getDotClasses("al-mushrif-children")} top-4 left-[42px]`}
            >
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses("al-mushrif-children")} w-[54px] h-12 top-0 left-0`}
              alt="Vector"
              src="/vector-51.svg"
              width={54}
              height={12}
            />
          </div>

          {/* Sadyat Civil Defense */}
          <div
            className={`absolute w-[26px] h-[59px] top-[850px] left-[881px] transition-all duration-300 ${getElementOpacity("sadyat-civil-defense")} ${getElementScale("sadyat-civil-defense")}`}
          >
            <div
              className={`${getDotClasses("sadyat-civil-defense")} top-[33px] left-0`}
            >
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses("sadyat-civil-defense")} w-[5px] h-[47px] top-0 left-[11px]`}
              alt="Vector"
              src="/vector-44.svg"
              width={5}
              height={47}
            />
          </div>

          {/* Additional markers with proper positioning */}
          <div
            className={`absolute w-[26px] h-[46px] top-[1128px] left-[923px] transition-all duration-300 ${getElementOpacity()} ${getElementScale()}`}
          >
            <div className={`${getDotClasses()} top-5 left-0`}>
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses()} w-1.5 h-[30px] top-0 left-2.5`}
              alt="Vector"
              src="/vector-30.svg"
              width={1.5}
              height={30}
            />
          </div>

          <div
            className={`absolute w-[26px] h-[46px] top-[1156px] left-[853px] transition-all duration-300 ${getElementOpacity()} ${getElementScale()}`}
          >
            <div className={`${getDotClasses()} top-5 left-0`}>
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses()} w-1.5 h-[30px] top-0 left-2.5`}
              alt="Vector"
              src="/vector-30.svg"
              width={1.5}
              height={30}
            />
          </div>

          {/* Urgent Point - Shahkbout */}
          <div
            className={`absolute w-[50px] h-[49px] top-[1200px] left-[1465px] transition-all duration-300 ${getElementOpacity("urgent-point-shahkbout")} ${getElementScale("urgent-point-shahkbout")}`}
            onMouseEnter={() => handleLabelHover("urgent-point-shahkbout")}
            onMouseLeave={() => handleLabelHover(null)}
          >
            <div
              className={`${getDotClasses("urgent-point-shahkbout")} top-[23px] left-6`}
            >
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses("urgent-point-shahkbout")} w-[35px] h-[35px] top-0 left-0 hover:scale-110 transition-transform duration-300`}
              alt="Vector"
              src="/vector-31.svg"
              width={35}
              height={35}
            />

            {/* Connection line to NGC Abu Dhabi Airport */}
            <div
              className={`absolute w-[2px] h-[169px] bg-gradient-to-b from-white/70 to-white/30 transition-opacity duration-300 ${hoveredLabel === "urgent-point-shahkbout" ? "opacity-100" : "opacity-0"}`}
              style={{
                top: "49px",
                left: "25px",
                boxShadow: "0 0 4px rgba(255, 255, 255, 0.5)",
              }}
            />

            {/* Hover label */}
            {hoveredLabel === "urgent-point-shahkbout" && (
              <div
                className="absolute bg-black/90 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap z-50 animate-in fade-in duration-200"
                style={{
                  top: "-40px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <span>NGC Abu Dhabi - Urgent Point Shahkbout</span>
                <div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
                  style={{
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: "6px solid rgba(0, 0, 0, 0.9)",
                  }}
                />
              </div>
            )}
          </div>

          {/* Traffic And Patrol + Clinics Al Shamkha Complex */}
          <div
            onMouseEnter={() => handleLabelHover("traffic-patrol-general")}
            onMouseLeave={() => handleLabelHover(null)}
            className={`absolute w-[321px] h-[111px] top-[1258px] left-[1618px] transition-all duration-300 cursor-pointer ${getElementOpacity("traffic-patrol-general")} ${getElementScale("traffic-patrol-general")}`}
          >
            <div className="absolute w-[321px] h-[104px] top-0 left-0">
              <div className="absolute w-[321px] h-[83px] top-0 left-0">
                <div
                  onMouseEnter={() =>
                    handleLabelHover("traffic-patrol-general")
                  }
                  onMouseLeave={() => handleLabelHover(null)}
                  className={`${getDotClasses("traffic-patrol-general")} top-[19px] left-[30px] cursor-pointer`}
                >
                  <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
                </div>
                <div
                  onMouseEnter={() => handleLabelHover("clinics-al-shamkha")}
                  onMouseLeave={() => handleLabelHover(null)}
                  className={`${getDotClasses("clinics-al-shamkha")} top-[57px] left-0 cursor-pointer`}
                >
                  <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
                </div>
                <Image
                  onMouseEnter={() =>
                    handleLabelHover("traffic-patrol-general")
                  }
                  onMouseLeave={() => handleLabelHover(null)}
                  className={`${getVectorClasses("traffic-patrol-general")} w-[23px] h-[31px] top-0 left-[19px] cursor-pointer`}
                  alt="Vector"
                  src="/vector-39.svg"
                  width={23}
                  height={31}
                />
                <Image
                  onMouseEnter={() => handleLabelHover("clinics-al-shamkha")}
                  onMouseLeave={() => handleLabelHover(null)}
                  className={`${getVectorClasses("clinics-al-shamkha")} w-[67px] h-[34px] top-9 left-3 cursor-pointer`}
                  alt="Vector"
                  src="/vector-50.svg"
                  width={67}
                  height={34}
                />
                <Button
                  onClick={() =>
                    router.push(
                      `/dashboard/abu-dhabi-traffic-patrol-general?name=${encodeURIComponent("Traffic And Patrol + General Maintenance")}&nameAr=${encodeURIComponent("المرور والدوريات + الصيانة العامة")}`,
                    )
                  }
                  onMouseEnter={() =>
                    handleLabelHover("traffic-patrol-general")
                  }
                  onMouseLeave={() => handleLabelHover(null)}
                  className={getLabelClasses("traffic-patrol-general")}
                  style={{
                    width: "245px",
                    height: "27px",
                    position: "absolute",
                    top: "14px",
                    left: "76px",
                  }}
                >
                  <span className={`text-[13px] ${getTextClasses()}`}>
                    Traffic And Patrol + General Maintenance
                  </span>
                </Button>
              </div>
              <Button
                onClick={() =>
                  router.push(
                    `/dashboard/abu-dhabi-clinics-al-shamkha?name=${encodeURIComponent("Clinics - Al Shamkha")}&nameAr=${encodeURIComponent("عيادات - الشامخة")}`,
                  )
                }
                onMouseEnter={() => handleLabelHover("clinics-al-shamkha")}
                onMouseLeave={() => handleLabelHover(null)}
                className={`group flex items-center justify-center px-3 py-2 bg-white hover:bg-black rounded-full border-2 border-solid transition-all duration-300 cursor-pointer font-sans font-medium ${hoveredLabel === "clinics-al-shamkha" ? "shadow-lg shadow-blue-500/50 ring-2 ring-blue-400 z-50 scale-110" : `${getElementOpacity("clinics-al-shamkha")} ${getElementScale("clinics-al-shamkha")}`}`}
                style={{
                  width: "145px",
                  height: "29px",
                  position: "absolute",
                  top: "75px",
                  left: "130px",
                }}
              >
                <span className={`text-[14px] ${getTextClasses()}`}>
                  Clinics - Al Shamkha
                </span>
              </Button>
            </div>
            {/* Update Start */}
            <div
              className="absolute w-[86px] h-[26px] top-[85px] left-11 cursor-pointer"
              onClick={() =>
                router.push(
                  `/dashboard/abu-dhabi-clinics-al-shamkha?name=${encodeURIComponent("Clinics - Al Shamkha")}&nameAr=${encodeURIComponent("عيادات - الشامخة")}`,
                )
              }
              onMouseEnter={() => handleLabelHover("clinics-al-shamkha")}
              onMouseLeave={() => handleLabelHover(null)}
            >
              <div
                className={`${getDotClasses("clinics-al-shamkha")} top-0 left-0 cursor-pointer`}
                onClick={() =>
                  router.push(
                    `/dashboard/abu-dhabi-clinics-al-shamkha?name=${encodeURIComponent("Clinics - Al Shamkha")}&nameAr=${encodeURIComponent("عيادات - الشامخة")}`,
                  )
                }
              >
                <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
              </div>
              <Image
                className={`${getVectorClasses("clinics-al-shamkha")} w-[73px] h-[13px] top-0 left-3 cursor-pointer`}
                alt="Vector"
                src="/vector-50.svg"
                width={73}
                height={13}
                onClick={() =>
                  router.push(
                    `/dashboard/abu-dhabi-clinics-al-shamkha?name=${encodeURIComponent("Clinics - Al Shamkha")}&nameAr=${encodeURIComponent("عيادات - الشامخة")}`,
                  )
                }
              />
            </div>
            {/* Update End */}
          </div>

          {/* New Alfalah Civil Defense */}
          <div
            className={`absolute w-[35px] h-11 top-[1116px] left-[1699px] transition-all duration-300 ${getElementOpacity("new-alfalah-civil-defense")} ${getElementScale("new-alfalah-civil-defense")}`}
          >
            <div
              className={`${getDotClasses("new-alfalah-civil-defense")} top-[18px] left-[9px]`}
            >
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses("new-alfalah-civil-defense")} w-[23px] h-[31px] top-0 left-0`}
              alt="Vector"
              src="/vector-38.svg"
              width={23}
              height={31}
            />
          </div>

          {/* Haggana Offices */}
          <div
            className={`absolute w-[70px] h-[54px] top-[1715px] left-[1514px] transition-all duration-300 ${getElementOpacity("haggana-offices")} ${getElementScale("haggana-offices")}`}
          >
            <div className={`${getDotClasses("haggana-offices")} top-7 left-0`}>
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses("haggana-offices")} w-[58px] h-[41px] top-0 left-3`}
              alt="Vector"
              src="/vector-40.svg"
              width={58}
              height={41}
            />
          </div>

          {/* Al Wathba Civil Defense Gym */}
          <div
            className={`absolute w-[70px] h-[54px] top-[1616px] left-[1492px] transition-all duration-300 ${getElementOpacity("al-wathba-civil-defense")} ${getElementScale("al-wathba-civil-defense")}`}
          >
            <div
              className={`${getDotClasses("al-wathba-civil-defense")} top-7 left-0`}
            >
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses("al-wathba-civil-defense")} w-[58px] h-[41px] top-0 left-3`}
              alt="Vector"
              src="/vector-40.svg"
              width={58}
              height={41}
            />
          </div>

          {/* Sih Shoaib Civil Defense */}
          <div
            className={`absolute w-[53px] h-12 top-[819px] left-[1475px] transition-all duration-300 ${getElementOpacity("sih-shoaib-civil-defense")} ${getElementScale("sih-shoaib-civil-defense")}`}
          >
            <div
              className={`${getDotClasses("sih-shoaib-civil-defense")} top-[22px] left-[27px]`}
            >
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses("sih-shoaib-civil-defense")} w-[38px] h-[35px] top-0 left-0`}
              alt="Vector"
              src="/vector-23.svg"
              width={38}
              height={35}
            />
          </div>

          {/* DPSC Al Shahama Clinic */}
          <div
            className={`absolute w-[42px] h-[70px] top-[777px] left-[1606px] transition-all duration-300 ${getElementOpacity("dpsc-al-shahama-clinic")} ${getElementScale("dpsc-al-shahama-clinic")}`}
          >
            <div
              className={`${getDotClasses("dpsc-al-shahama-clinic")} top-11 left-0`}
            >
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses("dpsc-al-shahama-clinic")} w-[30px] h-[57px] top-0 left-3`}
              alt="Vector"
              src="/vector-49.svg"
              width={30}
              height={57}
            />
          </div>

          {/* Urgent Point - Al Rahbah */}
          <div
            className={`absolute w-[163px] h-[85px] top-[640px] left-[1474px] transition-all duration-300 ${getElementOpacity("urgent-point-al-rahbah")} ${getElementScale("urgent-point-al-rahbah")}`}
          >
            <div
              className={`${getDotClasses("urgent-point-al-rahbah")} top-[59px] left-[68px]`}
            >
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses("urgent-point-al-rahbah")} w-1.5 h-[43px] top-6 left-[78px]`}
              alt="Vector"
              src="/vector-33.svg"
              width={1.5}
              height={43}
            />
            <Button
              onClick={() =>
                router.push(
                  `/dashboard/abu-dhabi-urgent-point-al-rahbah?name=${encodeURIComponent("Urgent Point - Al Rahbah")}&nameAr=${encodeURIComponent("نقطة عاجلة - الرحبة")}`,
                )
              }
              onMouseEnter={() => handleLabelHover("urgent-point-al-rahbah")}
              onMouseLeave={() => handleLabelHover(null)}
              className={getLabelClasses("urgent-point-al-rahbah")}
              style={{
                width: "163px",
                height: "26px",
                position: "absolute",
                top: "0",
                left: "0",
              }}
            >
              <span className={`text-[14px] ${getTextClasses()}`}>
                Urgent Point - Al Rahbah
              </span>
            </Button>
          </div>

          {/* Al Rahba Police Station Complex */}
          <div
            className={`absolute w-[316px] h-[104px] top-[438px] left-[1651px] transition-all duration-300 ${getElementOpacity("al-rahba-police-hcni")} ${getElementScale("al-rahba-police-hcni")}`}
          >
            <div className="absolute w-[163px] h-[70px] top-0 left-0">
              <div
                className={`${getDotClasses("al-rahba-police-hcni")} top-11 left-[69px]`}
              >
                <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
              </div>
              <Image
                className={`${getVectorClasses("al-rahba-police-hcni")} w-1.5 h-[43px] top-3.5 left-[79px]`}
                alt="Vector"
                src="/vector-33.svg"
                width={1.5}
                height={43}
              />
              <Button
                onClick={() =>
                  router.push(
                    `/dashboard/abu-dhabi-al-rahba-police-hcni?name=${encodeURIComponent("Al Rahba Police Station - AD Police HCNI")}&nameAr=${encodeURIComponent("مركز شرطة الرحبة - شرطة أبوظبي HCNI")}`,
                  )
                }
                onMouseEnter={() => handleLabelHover("al-rahba-police-hcni")}
                onMouseLeave={() => handleLabelHover(null)}
                className={getLabelClasses("al-rahba-police-hcni")}
                style={{
                  width: "163px",
                  height: "17px",
                  position: "absolute",
                  top: "0",
                  left: "0",
                }}
              >
                <span className={`text-[11px] ${getTextClasses()}`}>
                  Al Rahba Police Station - AD Police HCNI
                </span>
              </Button>
            </div>

            <div className="absolute w-[190px] h-[75px] top-[29px] left-[126px]">
              <div
                className={`${getDotClasses("al-rahba-police-rcc")} top-[49px] left-[21px]`}
              >
                <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
              </div>
              <Image
                className={`${getVectorClasses("al-rahba-police-rcc")} w-1.5 h-[43px] top-[19px] left-[31px]`}
                alt="Vector"
                src="/vector-33.svg"
                width={1.5}
                height={43}
              />
              <Button
                onClick={() =>
                  router.push(
                    `/dashboard/abu-dhabi-al-rahba-police-rcc?name=${encodeURIComponent("Al Rahba Police Station - AD Police RCC")}&nameAr=${encodeURIComponent("مركز شرطة الرحبة - شرطة أبوظبي RCC")}`,
                  )
                }
                onMouseEnter={() => handleLabelHover("al-rahba-police-rcc")}
                onMouseLeave={() => handleLabelHover(null)}
                className={getLabelClasses("al-rahba-police-rcc")}
                style={{
                  width: "190px",
                  height: "20px",
                  position: "absolute",
                  top: "0",
                  left: "0",
                }}
              >
                <span className={`text-[12px] ${getTextClasses()}`}>
                  Al Rahba Police Station - AD Police RCC
                </span>
              </Button>
            </div>
          </div>

          {/* Additional vector marker */}
          <div
            className={`absolute w-[26px] h-14 top-[475px] left-[1507px] transition-all duration-300 ${getElementOpacity()} ${getElementScale()}`}
          >
            <div className={`${getDotClasses()} top-[30px] left-0`}>
              <div className="relative w-[11.3px] h-[11.3px] bg-white rounded-[5.65px] wave-circle" />
            </div>
            <Image
              className={`${getVectorClasses()} w-1.5 h-[43px] top-0 left-2.5`}
              alt="Vector"
              src="/vector-33.svg"
              width={1.5}
              height={43}
            />
          </div>

          {/* All standalone label buttons */}
          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-urgent-point-al-bahyah?name=${encodeURIComponent("Urgent Point - Al Bahyah")}&nameAr=${encodeURIComponent("نقطة عاجلة - الباهية")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("urgent-point-al-bahyah")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("urgent-point-al-bahyah")}
            style={{
              width: "163px",
              height: "29px",
              position: "absolute",
              top: "787px",
              left: "1389px",
            }}
          >
            <span className={`text-[14px] ${getTextClasses()}`}>
              Urgent Point - Al Bahyah
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-urgent-point-al-aliah?name=${encodeURIComponent("Urgent Point - Al Aliah")}&nameAr=${encodeURIComponent("نقطة عاجلة - العالية")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("urgent-point-al-aliah")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("urgent-point-al-aliah")}
            style={{
              width: "164px",
              height: "26px",
              position: "absolute",
              top: "562px",
              left: "1190px",
            }}
          >
            <span className={`text-[14px] ${getTextClasses()}`}>
              Urgent Point - Al Aliah
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-urgent-point-al-nahdha?name=${encodeURIComponent("Urgent Point - Al Nahdha")}&nameAr=${encodeURIComponent("نقطة عاجلة - النهضة")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("urgent-point-al-nahdha")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("urgent-point-al-nahdha")}
            style={{
              width: "161px",
              height: "25px",
              position: "absolute",
              top: "1474px",
              left: "1252px",
            }}
          >
            <span className={`text-[14px] ${getTextClasses()}`}>
              Urgent Point - Al Nahdha
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-urgent-point-shahkbout?name=${encodeURIComponent("Urgent Point - Shahkbout")}&nameAr=${encodeURIComponent("نقطة عاجلة - الش��امة")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("urgent-point-shahkbout")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("urgent-point-shahkbout")}
            style={{
              width: "170px",
              height: "27px",
              position: "absolute",
              top: "1217px",
              left: "1279px",
            }}
          >
            <span className={`text-[14px] ${getTextClasses()}`}>
              Urgent Point - Shahkbout
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-urgent-point-rabdan-1?name=${encodeURIComponent("Urgent Point - Rabdan 1")}&nameAr=${encodeURIComponent("نقطة عاجلة - ربدان 1")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("urgent-point-rabdan-1")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("urgent-point-rabdan-1")}
            style={{
              width: "163px",
              height: "26px",
              position: "absolute",
              top: "1232px",
              left: "958px",
            }}
          >
            <span className={`text-[14px] ${getTextClasses()}`}>
              Urgent Point - Rabdan 1
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-urgent-point-al-bateen?name=${encodeURIComponent("Urgent Point - Al Bateen")}&nameAr=${encodeURIComponent("نقطة عاجلة - البطين")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("urgent-point-al-bateen")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("urgent-point-al-bateen")}
            style={{
              width: "162px",
              height: "25px",
              position: "absolute",
              top: "964px",
              left: "607px",
            }}
          >
            <span className={`text-[14px] ${getTextClasses()}`}>
              Urgent Point - Al Bateen
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-urgent-point-al-muntazah?name=${encodeURIComponent("Urgent Point - Al Muntazah")}&nameAr=${encodeURIComponent("نقطة عاجلة - المنتزه")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("urgent-point-al-muntazah")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("urgent-point-al-muntazah")}
            style={{
              width: "162px",
              height: "24px",
              position: "absolute",
              top: "1103px",
              left: "865px",
            }}
          >
            <span className={`text-[13px] ${getTextClasses()}`}>
              Urgent Point - Al Muntazah
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-ngc-abu-dhabi-airport?name=${encodeURIComponent("NGC Abu Dhabi Airport")}&nameAr=${encodeURIComponent("مركز أبوظبي للملاحة الجوية")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("ngc-abu-dhabi-airport")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("ngc-abu-dhabi-airport")}
            style={{
              width: "171px",
              height: "27px",
              position: "absolute",
              top: "1168px",
              left: "1382px",
            }}
          >
            <span className={`text-[14px] ${getTextClasses()}`}>
              NGC Abu Dhabi Airport
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-shooting-range-ad-police-rcc?name=${encodeURIComponent("Shooting Range - AD Police RCC")}&nameAr=${encodeURIComponent("ميدان الرماية - شرطة أبوظبي")}`,
              )
            }
            onMouseEnter={() =>
              handleLabelHover("shooting-range-ad-police-rcc")
            }
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("shooting-range-ad-police-rcc")}
            style={{
              width: "206px",
              height: "27px",
              position: "absolute",
              top: "1725px",
              left: "1858px",
            }}
          >
            <span className={`text-[14px] ${getTextClasses()}`}>
              Shooting Range - AD Police RCC
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-police-center-musaffah?name=${encodeURIComponent("Police Center Musaffah - AD Police RCC")}&nameAr=${encodeURIComponent("مركز شرطة مصفح - شرطة أبوظبي")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("police-center-musaffah")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("police-center-musaffah")}
            style={{
              width: "255px",
              height: "27px",
              position: "absolute",
              top: "1400px",
              left: "860px",
            }}
          >
            <span className={`text-[14px] ${getTextClasses()}`}>
              Police Center Musaffah - AD Police RCC
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-special-task-sector?name=${encodeURIComponent("Special Task Sector - AD Police RCC")}&nameAr=${encodeURIComponent("قطاع المهام الخاصة - شرطة أبوظبي")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("special-task-sector")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("special-task-sector")}
            style={{
              width: "190px",
              height: "22px",
              position: "absolute",
              top: "1133px",
              left: "732px",
            }}
          >
            <span className={`text-[13px] ${getTextClasses()}`}>
              Special Task Sector - AD Police RCC
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-shamkha-community-police?name=${encodeURIComponent("Shamkha Community Police")}&nameAr=${encodeURIComponent("شرطة مجتمع الشامخة")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("shamkha-community-police")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("shamkha-community-police")}
            style={{
              width: "159px",
              height: "25px",
              position: "absolute",
              top: "1229px",
              left: "1571px",
            }}
          >
            <span className={`text-[14px] ${getTextClasses()}`}>
              Shamkha Community Police
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-haggana-offices?name=${encodeURIComponent("Haggana Offices")}&nameAr=${encodeURIComponent("مكاتب الهجانة")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("haggana-offices")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("haggana-offices")}
            style={{
              width: "151px",
              height: "33px",
              position: "absolute",
              top: "1680px",
              left: "1516px",
            }}
          >
            <span className={`text-[15px] ${getTextClasses()}`}>
              Haggana Offices
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-shakboot-civil-defense?name=${encodeURIComponent("Shakboot Civil Defense")}&nameAr=${encodeURIComponent("دفاع مدني الشخبوط")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("shakboot-civil-defense")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("shakboot-civil-defense")}
            style={{
              width: "138px",
              height: "22px",
              position: "absolute",
              top: "1357px",
              left: "1463px",
            }}
          >
            <span className={`text-[13px] ${getTextClasses()}`}>
              Shakboot Civil Defense
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-sadyat-civil-defense?name=${encodeURIComponent("Sadyat Civil Defense")}&nameAr=${encodeURIComponent("دفاع مدني السعديات")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("sadyat-civil-defense")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("sadyat-civil-defense")}
            style={{
              width: "162px",
              height: "25px",
              position: "absolute",
              top: "821px",
              left: "798px",
            }}
          >
            <span className={`text-[14px] ${getTextClasses()}`}>
              Sadyat Civil Defense
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-new-alfalah-civil-defense?name=${encodeURIComponent("New Alfalah Civil Defense")}&nameAr=${encodeURIComponent("دفاع مدني الف��اح الجديد")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("new-alfalah-civil-defense")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("new-alfalah-civil-defense")}
            style={{
              width: "180px",
              height: "28px",
              position: "absolute",
              top: "1084px",
              left: "1611px",
            }}
          >
            <span className={`text-[14px] ${getTextClasses()}`}>
              New Alfalah Civil Defense
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-sih-shoaib-civil-defense?name=${encodeURIComponent("Sih Shoaib Civil Defense")}&nameAr=${encodeURIComponent("دفاع مدني سيح شعيب")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("sih-shoaib-civil-defense")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("sih-shoaib-civil-defense")}
            style={{
              width: "164px",
              height: "26px",
              position: "absolute",
              top: "449px",
              left: "1427px",
            }}
          >
            <span className={`text-[14px] ${getTextClasses()}`}>
              Sih Shoaib Civil Defense
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-al-wathba-civil-defense?name=${encodeURIComponent("Al Wathba Civil Defense Gym")}&nameAr=${encodeURIComponent("صالة دفاع مدني الوثبة")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("al-wathba-civil-defense")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("al-wathba-civil-defense")}
            style={{
              width: "219px",
              height: "32px",
              position: "absolute",
              top: "1582px",
              left: "1455px",
            }}
          >
            <span className={`text-[14px] ${getTextClasses()}`}>
              Al Wathba Civil Defense Gym
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-dpsc-al-shahama-clinic?name=${encodeURIComponent("DPSC Al Shahama Clinic")}&nameAr=${encodeURIComponent("عيادة مركز شرطة الشهامة")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("dpsc-al-shahama-clinic")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("dpsc-al-shahama-clinic")}
            style={{
              width: "212px",
              height: "31px",
              position: "absolute",
              top: "745px",
              left: "1581px",
            }}
          >
            <span className={`text-[14px] ${getTextClasses()}`}>
              DPSC Al Shahama Clinic
            </span>
          </Button>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/abu-dhabi-al-mushrif-children?name=${encodeURIComponent("Al Mushrif Children Speciality Centre")}&nameAr=${encodeURIComponent("مركز المشرف التخصص�� للأطفال")}`,
              )
            }
            onMouseEnter={() => handleLabelHover("al-mushrif-children")}
            onMouseLeave={() => handleLabelHover(null)}
            className={getLabelClasses("al-mushrif-children")}
            style={{
              width: "275px",
              height: "29px",
              position: "absolute",
              top: "1162px",
              left: "454px",
            }}
          >
            <span className={`text-[14px] ${getTextClasses()}`}>
              Al Mushrif Children Speciality Centre
            </span>
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
                      Abu Dhabi Interactive Map - Mouse wheel to zoom | Keys: F
                      (fullscreen), +/- (zoom), 0 (reset)
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
                    {isFullscreen ? "Exit" : "Fullscreen"} (F)
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
