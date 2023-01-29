import React, { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { getProject } from '@theatre/core'
import { SheetProvider } from '@theatre/r3f'
import studio from '@theatre/studio'
import { useKTX2 } from '@react-three/drei'
import { Postprocess } from "../../postprocess.js"

const sceneESheet = getProject('3D Mockup').sheet('SceneE')

const planeTextures = [
  '/scene1/sbqk0ip_4K_Normal.ktx2',
  '/scene1/sbqk0ip_4K_Roughness.ktx2',
  '/scene2/roughness_2k.ktx2',
  '/scene2/normal_2k.ktx2',
  '/scene2/albedo_2k.ktx2'
]

const Scene = () => {
  const plane = useRef(null)
  const rocck = useGLTF('/scene2/Rocck-pixel.glb')

  const [
    normal4k,
    roughness4k,
    roughness2k,
    normal2k,
    albedo2k
  ] = useKTX2(planeTextures)

  normal4k.repeat.set(4, 4)
  normal4k.wrapS = THREE.RepeatWrapping
  normal4k.wrapT = THREE.RepeatWrapping

  roughness4k.repeat.set(4, 4)
  roughness4k.wrapS = THREE.RepeatWrapping
  roughness4k.wrapT = THREE.RepeatWrapping

  albedo2k.encoding = THREE.sRGBEncoding

  useEffect(() => {
    const { default_material } = rocck.materials
    default_material.map = albedo2k
    default_material.normalMap = normal2k
    default_material.roughnessMap = roughness2k
  }, [rocck])

  rocck.scene.traverse(o => {
    if(o.isObject3D) o.castShadow = true
  })

  return (
    <group>
      <Suspense fallback={null}>
        <primitive object={rocck.scene} />
      </Suspense>
      <mesh ref={plane} rotation={[Math.PI/2, 0, 0]} scale={[4, 4, 4]} receiveShadow={true}>
        <planeGeometry attach='geometry' args={[4, 4]} />
        <meshStandardMaterial
          attach='material'
          roughness={0.8}
          metalness={0.0}
          normalMap={normal4k}
          roughnessMap={roughness4k}
          normalScale={[0.4, 0.4]}
          side={THREE.DoubleSide}
          color={new THREE.Color('#0b0b0b').convertLinearToSRGB()}
          envMapIntensity={0.7}
        />
      </mesh>
    </group>
  )
}

const Lights = () => {
  return (
    <>
      <pointLight
        position={[5, 2, 5]}
        color={[1, 1, 0.8]}
        intensity={50}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0003}
        castShadow={true}
      />

      <Environment
        background={true}
        preset='park'
        resolution={2048}
      >
      </Environment>
    </>
  )
}

export default function SceneE() {
  useEffect(() => studio.ui.restore(), [])

  const canvasRef = useRef(null)

  return (
    <div style={{ height: '100vh' }}>
      <Suspense fallback={null}>
        <Canvas
          gl={{
            stencil: false,
            antialias: false,
            premultipliedAlpha: true,
            physicallyCorrectLights: true
          }}
          ref={canvasRef}
          dpr={window.devicePixelRatio}
          shadows
        >
          <SheetProvider sheet={sceneESheet}>
            <OrbitControls target={[0, 0, 0]} minDistance={5} maxDistance={30} maxPolarAngle={Math.PI/2 - 0.3} />
            <PerspectiveCamera fov={50} makeDefault position={[-2, 1.5, 4]} near={0.5} far={50} />

            <Scene />

            <Lights />

            <Postprocess samples={4} dPR={window.devicePixelRatio} ppType={THREE.UnsignedByteType} />

          </SheetProvider>
        </Canvas>
      </Suspense>
    </div>
  )
}
