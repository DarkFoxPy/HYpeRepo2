"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Grid, PerspectiveCamera, Html } from "@react-three/drei"
import * as THREE from "three"
import type { Marker3D } from "@/lib/types"
import { DoorOpen, DoorClosed, Mic2, Store, Utensils, Info, Users } from "lucide-react"
import { MarkerPopup } from "./marker-popup"
import { getMarkerGeometry } from "@/lib/3d-objects-config"

const MARKER_ICONS: Record<string, any> = {
  entrance: DoorOpen,
  exit: DoorClosed,
  stage: Mic2,
  booth: Store,
  sponsor_booth: Store,
  info_booth: Store,
  food: Utensils,
  bathroom: Users,
  info: Info,
}

interface ViewerMarkerProps {
  marker: Marker3D
  onClick: () => void
}

function ViewerMarker({ marker, onClick }: ViewerMarkerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.position.y = marker.position.y + Math.sin(state.clock.elapsedTime * 2) * 0.1
    } else if (groupRef.current) {
      groupRef.current.position.y = marker.position.y
    }
  })

  const Icon = MARKER_ICONS[marker.type] || Info

  const DetailedModel = () => {
    const object3D = getMarkerGeometry(marker.type, marker.color)

    // Enable shadows for all meshes
    object3D.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    return <primitive object={object3D} />
  }

  return (
    <group
      ref={groupRef}
      position={[marker.position.x, marker.position.y, marker.position.z]}
      rotation={[marker.rotation.x, marker.rotation.y, marker.rotation.z]}
      scale={[marker.scale.x, marker.scale.y, marker.scale.z]}
      onContextMenu={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <DetailedModel />

      {/* Outer glow effect */}
      {hovered && (
        <mesh scale={1.15}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#f1c6ff" transparent opacity={0.3} wireframe />
        </mesh>
      )}

      {/* Floating label on hover */}
      {hovered && (
        <Html position={[0, 3.5, 0]} center distanceFactor={10}>
          <div className="bg-[#1e1732]/95 backdrop-blur-sm border border-[#f1c6ff]/50 rounded-lg p-4 min-w-[250px] max-w-[350px] shadow-xl pointer-events-none">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4" style={{ color: marker.color }} />
              <h4 className="text-[#ffddff] font-bold text-base">{marker.name}</h4>
            </div>
            {marker.description && <p className="text-[#e2e2e2] text-sm mb-2">{marker.description}</p>}
            {marker.capacity && (
              <p className="text-xs text-[#78767b]">
                Capacidad: <span className="text-[#f1c6ff] font-semibold">{marker.capacity}</span>
              </p>
            )}
            <p className="text-xs text-[#f1c6ff] mt-2 font-medium">Click derecho para más detalles</p>
          </div>
        </Html>
      )}
    </group>
  )
}

interface ViewerFloorProps {
  width: number
  depth: number
  floorNumber: number
  floorHeight: number
  isVisible: boolean
  groundTexture: string
  venueType: "indoor" | "outdoor" | "hybrid"
}

function ViewerFloor({
  width,
  depth,
  floorNumber,
  floorHeight,
  isVisible,
  groundTexture,
  venueType,
}: ViewerFloorProps) {
  const floorY = floorNumber * floorHeight

  const getFloorColor = (texture: string): number => {
    const colors: Record<string, number> = {
      grass: 0x4a7c59,
      concrete: 0x808080,
      wood: 0x8b4513,
      tile: 0xf0f0f0,
      carpet: 0x8b0000,
    }
    return colors[texture] || 0x808080
  }

  if (!isVisible) {
    return null
  }

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={getFloorColor(groundTexture)} roughness={0.8} metalness={0.2} />
      </mesh>

      <Grid
        args={[width, depth]}
        position={[0, floorY + 0.01, 0]}
        cellSize={2}
        cellThickness={0.6}
        cellColor="#f1c6ff"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#ffddff"
        fadeDistance={100}
        fadeStrength={1}
        followCamera={false}
      />

      {/* Walls for indoor/hybrid venues */}
      {(venueType === "indoor" || venueType === "hybrid") && (
        <ViewerWalls width={width} depth={depth} floorNumber={floorNumber} floorHeight={floorHeight} />
      )}
    </group>
  )
}

interface ViewerWallsProps {
  width: number
  depth: number
  floorNumber: number
  floorHeight: number
}

function ViewerWalls({ width, depth, floorNumber, floorHeight }: ViewerWallsProps) {
  const floorY = floorNumber * floorHeight
  const height = floorHeight
  const wallThickness = 0.2

  return (
    <group>
      {/* Front Wall */}
      <mesh position={[0, floorY + height / 2, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, height, wallThickness]} />
        <meshStandardMaterial color={0xe0e0e0} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, floorY + height / 2, depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, height, wallThickness]} />
        <meshStandardMaterial color={0xe0e0e0} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-width / 2, floorY + height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial color={0xe0e0e0} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width / 2, floorY + height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial color={0xe0e0e0} roughness={0.9} metalness={0.1} />
      </mesh>
    </group>
  )
}

interface VenueViewerProps {
  markers: Marker3D[]
  onMarkerClick?: (marker: Marker3D) => void
  currentFloor?: number
  floorNames?: Record<number, string>
  sceneConfig?: {
    type: "indoor" | "outdoor" | "hybrid"
    floors: number
    floorHeight: number
    dimensions: { width: number; depth: number }
    lighting: "day" | "night" | "indoor"
    groundTexture: "grass" | "concrete" | "wood" | "tile" | "carpet"
  }
}

export function VenueViewer({
  markers,
  onMarkerClick,
  currentFloor = 0,
  floorNames = { 0: "Planta Baja" },
  sceneConfig = {
    type: "hybrid",
    floors: 0,
    floorHeight: 4,
    dimensions: { width: 80, depth: 60 },
    lighting: "indoor",
    groundTexture: "concrete",
  },
}: VenueViewerProps) {
  const [selectedMarker, setSelectedMarker] = useState<Marker3D | null>(null)

  const handleMarkerClick = (marker: Marker3D) => {
    setSelectedMarker(marker)
    onMarkerClick?.(marker)
  }

  const allFloors = Object.keys(floorNames)
    .map(Number)
    .sort((a, b) => b - a)

  const visibleMarkers = markers.filter((m) => m.floor === currentFloor)

  return (
    <>
      <div className="w-full h-full rounded-xl overflow-hidden border border-border/50 bg-background/50 relative">
        <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[40, 30, 40]} />

          <ambientLight intensity={0.6} />
          <directionalLight
            position={[20, 30, 10]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
          />
          <pointLight position={[-20, 20, -20]} intensity={0.8} color="#f1c6ff" />
          <pointLight position={[20, 10, 20]} intensity={0.8} color="#ffddff" />
          <pointLight position={[0, 25, 0]} intensity={0.6} color="#9333ea" />

          {allFloors.map((floor) => (
            <ViewerFloor
              key={floor}
              width={sceneConfig.dimensions.width}
              depth={sceneConfig.dimensions.depth}
              floorNumber={floor}
              floorHeight={sceneConfig.floorHeight}
              isVisible={floor === currentFloor}
              groundTexture={sceneConfig.groundTexture}
              venueType={sceneConfig.type}
            />
          ))}

          {visibleMarkers.map((marker) => (
            <ViewerMarker key={marker.id} marker={marker} onClick={() => handleMarkerClick(marker)} />
          ))}

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={10}
            maxDistance={80}
            maxPolarAngle={Math.PI / 2.2}
            mouseButtons={{
              LEFT: 2, // Right button rotates
              MIDDLE: 1, // Middle button pans
              RIGHT: 0, // Left button zooms
            }}
          />
        </Canvas>

        {/* Overlay UI */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
          <div className="glass px-6 py-3 rounded-full border border-border/50 pointer-events-auto">
            <p className="text-sm text-muted">
              <span className="font-semibold text-primary">Click izquierdo</span> para rotar •{" "}
              <span className="font-semibold text-secondary">Scroll</span> para zoom •{" "}
              <span className="font-semibold text-accent-pink">Click derecho</span> en objetos para detalles
            </p>
          </div>
        </div>
      </div>

      {selectedMarker && <MarkerPopup marker={selectedMarker} onClose={() => setSelectedMarker(null)} />}
    </>
  )
}
