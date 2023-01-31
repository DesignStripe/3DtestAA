import Lights from './lights'
import React, { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { getProject } from '@theatre/core'
import { SheetProvider } from '@theatre/r3f'
import studio from '@theatre/studio'
import { Postprocess } from '../../postprocess.js'
import { useKTX2 } from '@react-three/drei'

const sceneDSheet = getProject('3D Mockup').sheet('SceneD')

function Block({ ...props }) {
  const { scene, materials } = useGLTF('/scene1/blocks.glb')

  const [
    normalKTX2Tex,
    roughnessKTX2Tex,
    displacementKTX2Tex
  ] = useKTX2([
    '/scene1/sbqk0ip_4K_Normal.ktx2',
    '/scene1/sbqk0ip_4K_Roughness.ktx2',
    '/scene1/sbqk0ip_4K_Displacement.ktx2'
  ])

  normalKTX2Tex.wrapS = THREE.RepeatWrapping
  normalKTX2Tex.wrapT = THREE.RepeatWrapping
  normalKTX2Tex.encoding = THREE.LinearEncoding
  normalKTX2Tex.repeat.set(2, 2)

  roughnessKTX2Tex.wrapS = THREE.RepeatWrapping
  roughnessKTX2Tex.wrapT = THREE.RepeatWrapping
  roughnessKTX2Tex.encoding = THREE.LinearEncoding // default...
  roughnessKTX2Tex.repeat.set(2, 2)

  normalKTX2Tex.wrapS = THREE.RepeatWrapping
  normalKTX2Tex.wrapT = THREE.RepeatWrapping
  normalKTX2Tex.encoding = THREE.LinearEncoding
  normalKTX2Tex.repeat.set(2, 2)

  /*
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
  */

  useEffect(() => {
    const blockMat = materials.Block
    blockMat.metalness = 0.05
    blockMat.roughness = 0.6
    blockMat.normalScale = new THREE.Vector2(0.2, 0.2)
    blockMat.roughnessMap = roughnessKTX2Tex
    blockMat.normalMap = normalKTX2Tex
    blockMat.displacementMap = displacementKTX2Tex
    blockMat.displacementScale = 0
    blockMat.displacementBias = 0
    //blockMat.map = roughnessKTX2Tex
    blockMat.color = new THREE.Color('#070707').convertLinearToSRGB()
    blockMat.envMapIntensity = 2.0

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
          emissive={new THREE.Color('#444').convertLinearToSRGB()}
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
      <color args={['#000']} attach='background' />
      <Screen />
      <Block />
      <Laptop />
    </>
  )
}

// Change this term to sacrifice quality for speed
const HIGH_QUALITY = true

export default function SceneD() {
  useEffect(() => studio.ui.restore(), [])

  const canvasRef = useRef(null)

  return (
    <div style={{ height: '100vh' }}>
      <Suspense fallback={null}>
        <Canvas
          gl={{
            stencil: false,
            premultipliedAlpha: true,
            antialias: false
        }}
          ref={canvasRef}
          dpr={window.devicePixelRatio}
          shadows
        >
          <SheetProvider sheet={sceneDSheet}>
            <OrbitControls target={[0, 1.5, 0]} />
            <PerspectiveCamera fov={22} makeDefault position={[-2, 3.45, 2]} near={1} far={50} />

            <Mockups />

            <Lights />

            <Postprocess
              samples={HIGH_QUALITY ? 8 : 2}
              dPR={window.devicePixelRatio}
              ppType={HIGH_QUALITY ? THREE.HalfFloatType : THREE.UnsignedByteType}
            />

          </SheetProvider>
        </Canvas>
      </Suspense>
    </div>
  )
}
