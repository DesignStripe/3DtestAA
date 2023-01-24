import React from 'react'
import { Environment, Lightformer } from '@react-three/drei'

const Lights = () => {
  return (
    <>
      <spotLight
        theatreKey='spotlight'
        position={[2, 3, 0]}
        color={[1, 1, 1]}
        intensity={0.9}
        penumbra={0.9}
        angle={0.6}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0006}
        decay={10}
        distance={40}
        castShadow={true}
      />

      <Environment
        background={false}
        preset='night'
        resolution={128}
      >
        <Lightformer form="rect" intensity={1} color="white" scale={[1, 5, 1]} target={[0, 0, 0]} position={[2, 1, 0]} />
        <Lightformer form="rect" intensity={1.5} color="white" scale={[1, 1, 1]} target={[0, 0, 0]} position={[-3, 1, -3]} />
        <Lightformer form="rect" intensity={3} color="white" scale={[4, 2, 1]} target={[0, 0, 0]} position={[-2, 1, 2]} />
        <Lightformer form="rect" intensity={1} color="white" scale={[4, 2, 1]} target={[0, 0, 0]} position={[2, -2, -1]} />
      </Environment>
    </>
  )
}

export default Lights