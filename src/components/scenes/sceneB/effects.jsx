import React from 'react'
import * as THREE from 'three'
import { Bloom, SMAA, EffectComposer, BrightnessContrast } from "@react-three/postprocessing"

export default function Effects() {
  return (
    <EffectComposer
      multisampling={0} // Should be set to 0 when SMAA is enabled, else up to 8 (however both can be on)
      frameBufferType={THREE.HalfFloatType}
    >
      <SMAA preset={3} />
      <Bloom kernelSize={5} intensity={0.1} luminanceSmoothing={0.025} luminanceThreshold={0.5} />
      <BrightnessContrast contrast={0.35} />
    </EffectComposer>
  )
}
