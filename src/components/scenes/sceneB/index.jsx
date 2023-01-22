import Lights from './lights'
import Effects from './effects'
import React, { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { getProject } from '@theatre/core'
import { SheetProvider } from '@theatre/r3f'
import studio from '@theatre/studio'

// More Colour Space issues in Postprocessing:
// https://github.com/pmndrs/postprocessing/issues/370
// There is an issue in postprocessing with sRGB colour spaces and banding.  See here:
// https://discourse.threejs.org/t/subtle-colour-banding-issue-looks-like-256-colours-when-using-bloom-with-effect-composer/31174
// Current postprocessing has performance and colour space problems:
// https://github.com/pmndrs/postprocessing/issues/419

// Takeaways:
// 1) MSAA is not applied to a single buffer but to two (very heavy performance impact)

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
    console.log(materials.Block)
    materials.Block.metalness = 0.05
    materials.Block.roughness = 0.7
    materials.Block.normalScale = new THREE.Vector2(0.4, 0.4)
    materials.Block.roughnessMap = roughnessTex
    materials.Block.normalMap = normalTex
    materials.Block.toneMapped = true
    materials.Block.color = new THREE.Color('#0e0e0e').convertLinearToSRGB()
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
    materials.Body.roughness = 0.4
    materials.Body.metalness = 0.5
    materials.Body.toneMapped = true
    materials.BodyScreen.roughness = 0.4
    materials.BodyScreen.metalness = 0.5
    materials.BodyScreen.toneMapped = true
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
          toneMapped={true}
          emissive={'grey'}
          emissiveIntensity={1.1}
          roughness={0.5}
          metalness={0}
        >
          <videoTexture
            attach='map'
            encoding={THREE.sRGBEncoding}
            generateMipmaps={true}
            minFilter={THREE.LinearMipMapLinearFilter}
            args={[video]}
          />
          <videoTexture
            attach='emissiveMap'
            encoding={THREE.sRGBEncoding}
            generateMipmaps={true}
            minFilter={THREE.LinearMipMapLinearFilter}
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

export default function SceneA() {
  useEffect(() => studio.ui.restore(), [])

  const canvasRef = useRef(null)

  // See: https://www.donmccurdy.com/2020/06/17/color-management-in-threejs
  return (
    <div style={{ height: '100vh' }}>
      <Suspense fallback={null}>
        <Canvas
          gl={{
            preserveDrawingBuffer: true,
            stencil: false,
            physicallyCorrectLights: true,
            antialias: false // Note: this is done explicitly in EffectComposer
        }}
          ref={canvasRef}
          dpr={window.devicePixelRatio}
          shadows
        >
          <SheetProvider sheet={sceneBSheet}>
            <OrbitControls target={[0, 1.5, 0]} />
            <PerspectiveCamera fov={22} makeDefault position={[-2, 3.45, 2]} />
            <Mockups />
            <Lights />
            <Effects />
          </SheetProvider>
        </Canvas>
      </Suspense>
    </div>
  )
}
