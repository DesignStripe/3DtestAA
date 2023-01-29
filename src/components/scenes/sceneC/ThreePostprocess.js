import * as THREE from 'three'
import React, { useMemo, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { BrightnessContrastShader } from 'three/examples/jsm/shaders/BrightnessContrastShader'

export function ThreePostprocess({ samples, dPR }) {
  const { gl, scene, camera, size } = useThree()

  const [renderPass, msaaEffect] = useMemo(() => {
    const msRenderTarget = new THREE.WebGLRenderTarget(1, 1, {
      samples,
      type: THREE.HalfFloatType,
      encoding: THREE.LinearEncoding // Internal rendering must use linear colour space
    })

    const renderPass = new RenderPass(scene, camera)
    const colourPass = new ShaderPass(BrightnessContrastShader)
    const gammaPass = new ShaderPass(GammaCorrectionShader)
    const bloomPass = new UnrealBloomPass(undefined, 0.1, 0.1, 0.1)
    const msaaEffect = new EffectComposer(gl, msRenderTarget)

    colourPass.uniforms.contrast.value = 0.04

    msaaEffect.addPass(renderPass)
    msaaEffect.addPass(bloomPass)
    msaaEffect.addPass(colourPass)
    msaaEffect.addPass(gammaPass)

    console.log('setup')

    return [renderPass, msaaEffect]
  }, [])

  useEffect(() => {
    const W = Math.floor(size.width * dPR), H = Math.floor(size.height * dPR)
    msaaEffect.setSize(W, H)
    msaaEffect.passes[1].resolution.set(W, H)
  }, [size, msaaEffect])

  useEffect(() => {
    renderPass.camera = camera
    renderPass.scene = scene
  }, [renderPass, scene, camera])

  useFrame(() => {
    msaaEffect.render()
  }, 1)

  return null
}
