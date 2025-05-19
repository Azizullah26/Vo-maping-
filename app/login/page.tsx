"use client"

import type React from "react"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Stars, useTexture, Environment, Text, Float } from "@react-three/drei"
import { Vector3, type Mesh } from "three"
import { motion } from "framer-motion"
import { useAuth } from "@/app/contexts/AuthContext"

// 3D Earth component
function Earth({ scale = 1.5 }) {
  const earthRef = useRef<Mesh>(null)
  const cloudRef = useRef<Mesh>(null)

  // Load textures
  const [earthTexture, cloudTexture, normalMap, specularMap] = useTexture([
    "/assets/earth_daymap.png",
    "/assets/earth_clouds.png",
    "/assets/earth_normal.png",
    "/assets/earth_specular.png",
  ])

  // Rotate the earth
  useFrame(({ clock }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.05
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y = clock.getElapsedTime() * 0.07
    }
  })

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={earthRef} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          map={earthTexture}
          normalMap={normalMap}
          metalnessMap={specularMap}
          metalness={0.2}
          roughness={0.7}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudRef} scale={scale * 1.01}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={cloudTexture} transparent={true} opacity={0.4} depthWrite={false} />
      </mesh>
    </group>
  )
}

// Floating points representing cities
function LocationPoints() {
  const points = [
    { position: [0.8, 0.6, 1.1], label: "Abu Dhabi" },
    { position: [0.9, 0.5, 1.0], label: "Dubai" },
    { position: [0.7, 0.7, 1.0], label: "Al Ain" },
    { position: [-0.5, 0.8, 0.9], label: "New York" },
    { position: [0.1, 0.9, 0.8], label: "London" },
    { position: [-0.8, 0.2, 0.9], label: "Tokyo" },
  ]

  return (
    <group>
      {points.map((point, i) => (
        <group key={i} position={new Vector3(...point.position).normalize().multiplyScalar(1.6)}>
          <mesh>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
          </mesh>
          <Float speed={5} rotationIntensity={0} floatIntensity={0.2}>
            <Text position={[0, 0.05, 0]} fontSize={0.05} color="#ffffff" anchorX="center" anchorY="middle">
              {point.label}
            </Text>
          </Float>
        </group>
      ))}
    </group>
  )
}

// Connection lines between points
function ConnectionLines() {
  const linesRef = useRef<any>()

  useFrame(({ clock }) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = clock.getElapsedTime() * 0.03
    }
  })

  return (
    <group ref={linesRef}>
      <mesh>
        <sphereGeometry args={[1.55, 24, 24]} />
        <meshBasicMaterial color="#0066ff" wireframe={true} transparent opacity={0.1} />
      </mesh>
    </group>
  )
}

// Camera controller
function CameraController() {
  const { camera } = useThree()
  const controlsRef = useRef<any>()

  useEffect(() => {
    camera.position.set(0, 0, 4)
  }, [camera])

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      rotateSpeed={0.2}
      autoRotate
      autoRotateSpeed={0.1}
      minPolarAngle={Math.PI / 2 - 0.5}
      maxPolarAngle={Math.PI / 2 + 0.5}
    />
  )
}

// Login form component
function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Check credentials
      if (username === "elrace" && password === "elrace1122") {
        // Simulate storing in database
        await login(username, password)

        // Redirect to main app
        setTimeout(() => {
          router.push("/")
        }, 1000)
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute top-1/2 right-[10%] transform -translate-y-1/2 w-full max-w-md z-10"
    >
      <div className="backdrop-blur-md bg-black/30 p-8 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(0,200,255,0.3)]">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">UAE Interactive Map</h1>
          <p className="text-cyan-300 text-sm">Enter your credentials to access the system</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter username"
                required
              />
              <div className="absolute inset-0 border border-cyan-400/0 rounded-md pointer-events-none transition-all duration-300 group-focus-within:border-cyan-400/50 group-focus-within:shadow-[0_0_10px_rgba(0,200,255,0.3)]"></div>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter password"
                required
              />
              <div className="absolute inset-0 border border-cyan-400/0 rounded-md pointer-events-none transition-all duration-300 group-focus-within:border-cyan-400/50 group-focus-within:shadow-[0_0_10px_rgba(0,200,255,0.3)]"></div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 disabled:opacity-50 relative overflow-hidden group"
          >
            <span className="relative z-10">{isLoading ? "Authenticating..." : "Sign In"}</span>
            <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">For demo: Username: elrace, Password: elrace1122</p>
        </div>
      </div>
    </motion.div>
  )
}

// Main login page component
export default function LoginPage() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas>
          <CameraController />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Suspense fallback={null}>
            <Earth />
            <LocationPoints />
            <ConnectionLines />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent pointer-events-none"></div>

      {/* Login form */}
      <LoginForm />

      {/* Decorative elements */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500">© 2023 UAE Interactive Map | ELRACE Projects</div>
    </div>
  )
}
