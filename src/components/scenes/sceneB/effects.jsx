import React from 'react'
import * as THREE from 'three'
import { Bloom, SMAA, EffectComposer, BrightnessContrast } from "@react-three/postprocessing"

export default function Effects({ smaa, level }) {
  return (
    <EffectComposer
      disableNormalPass={true}
      multisampling={smaa ? 0 : level}
      frameBufferType={THREE.HalfFloatType}
    >
      { smaa ? <SMAA preset={3} /> : null }
      <Bloom kernelSize={5} intensity={0.1} luminanceSmoothing={0.025} luminanceThreshold={0.5} />
      { /* Colour Adjustments to match tone of original */ }
      <BrightnessContrast contrast={0.35} />
    </EffectComposer>
  )
}
