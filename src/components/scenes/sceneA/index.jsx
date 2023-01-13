import Lights from "./lights"
import Effects from "./effects"
import React, { Suspense, useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, PerspectiveCamera, OrbitControls, useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { getProject } from "@theatre/core"
import studio from "@theatre/studio"
import extension from "@theatre/r3f/dist/extension"
import { editable as e, SheetProvider } from "@theatre/r3f"

studio.initialize()
studio.extend(extension)
const sceneASheet = getProject("3D Mockup").sheet("SceneA")

function Block({ ...props }) {
  const { scene, materials } = useGLTF("/scene1/blocks.glb")
  const roughnessTex = new THREE.TextureLoader().load("/scene1/sbqk0ip_4K_Roughness.jpg")
  const normalTex = new THREE.TextureLoader().load("/scene1/sbqk0ip_4K_Normal.jpg")
  roughnessTex.wrapS = THREE.RepeatWrapping
  roughnessTex.wrapT = THREE.RepeatWrapping
  roughnessTex.repeat.set(2, 2)
  normalTex.wrapS = THREE.RepeatWrapping
  normalTex.wrapT = THREE.RepeatWrapping
  normalTex.repeat.set(2, 2)

  useEffect(() => {
    console.log(materials.Block)
    materials.Block.metalness = 0.05
    materials.Block.roughness = 0.7
    materials.Block.normalScale = new THREE.Vector2(0.4, 0.4)
    materials.Block.roughnessMap = roughnessTex
    materials.Block.normalMap = normalTex
    materials.Block.color = new THREE.Color("#1e1e1e")
    scene.traverse((object) => {
      object.castShadow = true
      object.receiveShadow = true
    })
  }, [scene, materials])
  return (
    <group>
      <primitive object={scene} {...props} />
    </group>
  )
}

function Laptop({ ...props }) {
  const { scene, materials } = useGLTF("/scene1/macbookLaptop.glb")
  useEffect(() => {
    materials.Body.roughness = 0.4
    materials.BodyScreen.roughness = 0.6
    scene.traverse((object) => {
      object.castShadow = true
      object.receiveShadow = true
    })
  }, [scene, materials])
  return (
    <group>
      <primitive object={scene} {...props} />
    </group>
  )
}

function Screen() {
  const { nodes, materials } = useGLTF("/scene1/screen.glb")
  const [video, setVideo] = useState(() => {
    const vid = document.createElement("video")
    vid.src = "https://nextmockup3d.designstripe.app/Untitled.mp4"
    // vid.src = url
    vid.crossOrigin = "Anonymous"
    vid.loop = true
    vid.muted = true
    vid.play()
    return vid
  })

  return (
    <group position={[0.0005, -0.0011, -0.0019]}>
      <mesh geometry={nodes?.Screen?.geometry} position={[0.0005, 1.688, -0.393]}>
        <meshStandardMaterial emissiveIntensity={0.15} side={THREE.DoubleSide} emissive={"white"}>
          <videoTexture attach="map" args={[video]} />
          <videoTexture attach="emissiveMap" args={[video]} />
        </meshStandardMaterial>
      </mesh>
    </group>
  )
}

function Mockups() {
  return (
    <>
      <color args={["#000"]} attach="background" />
      <Screen />
      <Block />
      <Laptop />
    </>
  )
}

export default function SceneA() {
  const canvasRef = useRef(null)

  return (
    <div style={{ height: "100vh" }}>
      <Suspense fallback={null}>
        <Canvas gl={{ preserveDrawingBuffer: true }} ref={canvasRef} dpr={2} linear shadows>
          <SheetProvider sheet={sceneASheet}>
            <OrbitControls target={[0, 1.5, 0]} />
            <PerspectiveCamera fov={22} makeDefault position={[-2, 3.45, 2]} />
            <Effects />
            <Mockups />
            <Lights />
          </SheetProvider>
        </Canvas>
      </Suspense>
    </div>
  )
}
