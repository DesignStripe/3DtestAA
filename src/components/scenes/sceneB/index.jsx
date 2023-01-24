import Lights from './lights'
import Effects from './effects'
import React, { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { getProject } from '@theatre/core'
import { SheetProvider } from '@theatre/r3f'
import studio from '@theatre/studio'
import { ThreePostprocess } from "../sceneC/ThreePostprocess.js"

const sceneBSheet = getProject('3D Mockup').sheet('SceneB')

function Block({ ...props }) {
  const { scene, materials } = useGLTF('/scene1/blocks.glb')

  const roughnessTex = useLoader(THREE.TextureLoader, '/scene1/sbqk0ip_4K_Roughness.jpg')
  roughnessTex.wrapS = THREE.RepeatWrapping
  roughnessTex.wrapT = THREE.RepeatWrapping
  roughnessTex.encoding = THREE.LinearEncoding
  roughnessTex.repeat.set(2, 2)

  const normalTex = useLoader(THREE.TextureLoader, '/scene1/sbqk0ip_4K_Normal.jpg')
  normalTex.wrapS = THREE.RepeatWrapping
  normalTex.wrapT = THREE.RepeatWrapping
  normalTex.encoding = THREE.LinearEncoding
  normalTex.repeat.set(2, 2)

  useEffect(() => {
    const blockMat = materials.Block
    blockMat.metalness = 0.05
    blockMat.roughness = 0.7
    blockMat.normalScale = new THREE.Vector2(0.4, 0.4)
    blockMat.roughnessMap = roughnessTex
    blockMat.normalMap = normalTex
    blockMat.color = new THREE.Color('#070707').convertLinearToSRGB()
    blockMat.envMapIntensity = 0.8

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
  const { scene, materials } = useGLTF('/scene1/macbookLaptop.glb')
  useEffect(() => {
    const colour = new THREE.Color('#282828').convertLinearToSRGB()
    materials.Body.roughness = 0.45
    materials.Body.metalness = 0.5
    materials.Body.dithering = true
    materials.Body.color = colour
    materials.BodyScreen.roughness = 0.5
    materials.BodyScreen.metalness = 0.5
    materials.BodyScreen.dithering = true
    materials.BodyScreen.color = colour
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
  const { nodes } = useGLTF('/scene1/screen.glb')
  const [video] = useState(() => {
    const vid = document.createElement('video')
    vid.src = 'https://nextmockup3d.designstripe.app/Untitled.mp4'
    vid.crossOrigin = 'Anonymous'
    vid.loop = true
    vid.muted = true
    vid.play()
    return vid
  })

  return (
    <group position={[0.0005, -0.0011, -0.00019]}>
      <mesh geometry={nodes?.Screen?.geometry} position={[0.0005, 1.688, -0.393]}>
        <meshStandardMaterial
          emissive={new THREE.Color('#333').convertLinearToSRGB()}
          emissiveIntensity={1.1}
          roughness={1}
          metalness={0}
        >
          <videoTexture
            attach='map'
            encoding={THREE.sRGBEncoding}
            args={[video]}
          />
          <videoTexture
            attach='emissiveMap'
            encoding={THREE.sRGBEncoding}
            args={[video]}
          />
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

const USE_THREE_AA = true

export default function SceneA() {
  useEffect(() => studio.ui.restore(), [])

  const canvasRef = useRef(null)

  return (
    <div style={{ height: '100vh' }}>
      <Suspense fallback={null}>
        <Canvas
          gl={{
            stencil: false,
            premultipliedAlpha: true,
            antialias: false, // Note: this is done explicitly in EffectComposer
        }}
          ref={canvasRef}
          dpr={window.devicePixelRatio}
          shadows
        >
          <SheetProvider sheet={sceneBSheet}>
            <OrbitControls target={[0, 1.5, 0]} />
            <PerspectiveCamera fov={22} makeDefault position={[-2, 3.45, 2]} near={1} far={50} />

            <Mockups />

            <Lights />
            {
              USE_THREE_AA
              ? <ThreePostprocess dPR={window.devicePixelRatio} samples={8} />
              : <Effects level={8} />
            }

          </SheetProvider>
        </Canvas>
      </Suspense>
    </div>
  )
}
