"use client"

import { useEffect, useRef, useState } from "react"

export default function AlAin() {
  // Ref for the video element
  const videoRef = useRef<HTMLVideoElement>(null)

  // State to track if the video is playing
  const [isPlaying, setIsPlaying] = useState(false)

  // State to track if the video is muted
  const [isMuted, setIsMuted] = useState(true)

  // Add clouds animation state
  const [clouds, setClouds] = useState<
    Array<{ id: number; x: number; y: number; size: number; opacity: number; speed: number; zone: "top" | "bottom" }>
  >([])

  // Initialize clouds
  useEffect(() => {
    const initialClouds = [
      // Top clouds (moving from top-left to right)
      {
        id: 1,
        x: -20,
        y: Math.random() * 15 + 5, // Top 20% of screen
        size: Math.random() * 80 + 60,
        opacity: Math.random() * 0.4 + 0.3,
        speed: Math.random() * 0.3 + 0.2,
        zone: "top" as const,
      },
      {
        id: 2,
        x: -50,
        y: Math.random() * 15 + 10,
        size: Math.random() * 100 + 80,
        opacity: Math.random() * 0.3 + 0.2,
        speed: Math.random() * 0.25 + 0.15,
        zone: "top" as const,
      },
      // Bottom clouds
      {
        id: 3,
        x: -30,
        y: Math.random() * 15 + 75, // Bottom 25% of screen
        size: Math.random() * 90 + 70,
        opacity: Math.random() * 0.35 + 0.25,
        speed: Math.random() * 0.2 + 0.1,
        zone: "bottom" as const,
      },
      {
        id: 4,
        x: -60,
        y: Math.random() * 10 + 80,
        size: Math.random() * 110 + 90,
        opacity: Math.random() * 0.3 + 0.2,
        speed: Math.random() * 0.15 + 0.08,
        zone: "bottom" as const,
      },
    ]
    setClouds(initialClouds)
  }, [])

  // Animate clouds with smooth movement
  useEffect(() => {
    const interval = setInterval(() => {
      setClouds((prevClouds) =>
        prevClouds.map((cloud) => ({
          ...cloud,
          x: cloud.x >= 120 ? -30 : cloud.x + cloud.speed,
        })),
      )
    }, 16) // ~60fps for smooth animation

    return () => clearInterval(interval)
  }, [])

  // Function to toggle video playback
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Function to toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#c9d6ff] to-[#e2e2e2]"></div>

      {/* Animated Clouds */}
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="fixed pointer-events-none z-20"
          style={{
            left: `${cloud.x}%`,
            top: `${cloud.y}%`,
            transform: "translateX(-50%)",
            opacity: cloud.opacity,
            transition: "left 0.016s linear", // Smooth transition
          }}
        >
          <img
            src="/cloud-7.png"
            alt="Cloud"
            style={{
              width: `${cloud.size}px`,
              height: "auto",
              filter: "brightness(1.1) contrast(0.9)",
            }}
            className="drop-shadow-sm"
          />
        </div>
      ))}

      {/* Main Content Container */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {/* Video Container */}
        <div className="relative h-[calc(min(60vh,70vw))] w-[calc(min(60vh,70vw))] overflow-hidden rounded-3xl shadow-2xl">
          <video ref={videoRef} src="/al-ain.mp4" loop muted={isMuted} className="h-full w-full object-cover" />

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="absolute bottom-4 left-4 rounded-full bg-white/50 p-2 text-black backdrop-blur-md"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 rounded-full bg-white/50 p-2 text-black backdrop-blur-md"
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
        </div>
      </div>
    </div>
  )
}
