import * as THREE from 'three'
import React, { useMemo, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'

const BasicBlendShader = {
  uniforms: {
    'tDiffuse': { value: null },
    'tSecond': { value: null },
    'opacity': { value: 1.0 }
  },

  vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

  fragmentShader: /* glsl */`
		uniform float opacity;
		uniform sampler2D tDiffuse;
		uniform sampler2D tSecond;
		varying vec2 vUv;

		void main() {
  		gl_FragColor = mix(texture2D(tSecond, vUv), texture2D(tDiffuse, vUv), 0.);
		}`
};

/*
The postprocess chain is broken up into first resolving the MSAA buffers (if using MSAA) else we use a single postprocess
chain just for SMAA.
*/

export function Postprocess({ smaa, samples, dPR, ppType }) {
  const { gl, scene, camera, size } = useThree()

  const [composerAA, composerPP] = useMemo(() => {
    const twoStage = !smaa && samples > 0

    // The first composer is only needed in the MSAA case
    let effectComposerAA = null

    if (twoStage) {
      const msRenderTarget = new THREE.WebGLRenderTarget(1, 1, {
        samples,
        type: THREE.HalfFloatType,
        depthBuffer: true,
        encoding: THREE.LinearEncoding
      })

      effectComposerAA = new EffectComposer(gl, msRenderTarget)
      const renderPass = new RenderPass(scene, camera)
      effectComposerAA.addPass(renderPass)
      effectComposerAA.renderToScreen = false
    }

    const ppRenderTarget = new THREE.WebGLRenderTarget(1, 1, {
      type: ppType,
      depthBuffer: false,
      encoding: THREE.LinearEncoding
    })
    let postprocessComposer = new EffectComposer(gl, ppRenderTarget)

    if (effectComposerAA) {
      const customPass = new ShaderPass(BasicBlendShader)
      customPass.clear = true
      const bloomPass = new UnrealBloomPass(undefined, 0.1, 0.1, 0.1)
      postprocessComposer.addPass(customPass)
      postprocessComposer.addPass(bloomPass)
      postprocessComposer.passes[0].uniforms.tSecond.value = effectComposerAA.renderTarget2.texture
      postprocessComposer.renderToScreen = true
    } else {
      const renderPass = new RenderPass(scene, camera)
      postprocessComposer.addPass(renderPass)
    }

    return [effectComposerAA, postprocessComposer]
  }, [gl, scene, camera, samples, smaa])

  useEffect(() => {
    const W = Math.floor(size.width), H = Math.floor(size.height)

    composerPP.setSize(W, H)
    composerPP.setPixelRatio(dPR)

    if (composerAA != null) {
      composerAA.setSize(W, H)
      composerAA.setPixelRatio(dPR)
      composerPP.passes[0].uniforms.tSecond.value = composerAA.renderTarget2.texture
    }
  }, [size, composerAA, composerPP, dPR])

  useFrame(() => {
    if (composerAA != null) composerAA.render()
    composerPP.render()
  }, 1)
}
