"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import mapboxgl from "mapbox-gl"
import type React from "react" // Added import for React

interface ThreeWrapperProps {
  modelUrl: string
  map: mapboxgl.Map | null
  modelOrigin: [number, number]
  modelAltitude: number
  modelRotate: [number, number, number]
}

const ThreeWrapper: React.FC<ThreeWrapperProps> = ({ modelUrl, map, modelOrigin, modelAltitude, modelRotate }) => {
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.Camera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    if (!map) {
      console.error("Map is not available")
      return
    }

    console.log("ThreeWrapper: Initializing")

    const scene = new THREE.Scene()
    const camera = new THREE.Camera()
    sceneRef.current = scene
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: map.getCanvas().getContext("webgl2") as WebGLRenderingContext,
      antialias: true,
    })
    renderer.autoClear = false
    rendererRef.current = renderer

    const directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(0, -70, 100).normalize()
    scene.add(directionalLight)

    const directionalLight2 = new THREE.DirectionalLight(0xffffff)
    directionalLight2.position.set(0, 70, 100).normalize()
    scene.add(directionalLight2)

    const loader = new GLTFLoader()
    loader.load(
      modelUrl,
      (gltf) => {
        console.log("Model loaded successfully", gltf)
        scene.add(gltf.scene)
      },
      (progress) => {
        console.log("Loading progress:", (progress.loaded / progress.total) * 100, "%")
      },
      (error) => {
        console.error("Error loading model:", error)
      },
    )

    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude)

    const modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() * 100,
    }

    const animate = () => {
      requestAnimationFrame(animate)

      modelTransform.rotateZ += 0.01
      modelTransform.translateX += 0.00001
      modelTransform.translateY += 0.000005

      render()
    }

    const render = () => {
      if (!map || !sceneRef.current || !cameraRef.current || !rendererRef.current) return

      const rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), modelTransform.rotateX)
      const rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), modelTransform.rotateY)
      const rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), modelTransform.rotateZ)

      const m = new THREE.Matrix4().fromArray(map.transform.projMatrix as any)
      const l = new THREE.Matrix4()
        .makeTranslation(modelTransform.translateX, modelTransform.translateY, modelTransform.translateZ)
        .scale(new THREE.Vector3(modelTransform.scale, -modelTransform.scale, modelTransform.scale))
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ)

      cameraRef.current.projectionMatrix = m.multiply(l)
      rendererRef.current.resetState()
      rendererRef.current.render(sceneRef.current, cameraRef.current)
      map.triggerRepaint()
    }

    map.on("render", render)
    animate()

    return () => {
      map.off("render", render)
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
      // Cancel any ongoing load operations
      loader.manager.onError = () => {}
    }
  }, [map, modelUrl, modelOrigin, modelAltitude, modelRotate])

  return null
}

export default ThreeWrapper
