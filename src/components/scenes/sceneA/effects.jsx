import React from "react"
import { Bloom, SMAA, ChromaticAberration, Noise, EffectComposer } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import * as THREE from "three"

export default function Effects() {
  return (
    <EffectComposer>
      <SMAA preset={2} />
      <Noise opacity={0.08} premultiply blendFunction={BlendFunction.SCREEN} />
      {/* <ChromaticAberration offset={new THREE.Vector2(0.0001, 0.0001)} blendFunction={BlendFunction.NORMAL} /> */}
      <Bloom blendFunction={BlendFunction.ADD} width={1200} height={1200} kernelSize={5} intensity={0.1} luminanceSmoothing={0.125} luminanceThreshold={0.25} />
    </EffectComposer>
  )
}
