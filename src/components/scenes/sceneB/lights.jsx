import React from 'react'
import { Environment, Lightformer } from '@react-three/drei'

const Lights = () => {
  return (
    <>

      <spotLight
        position={[2, 3, 0]}
        color={[1, 1, 1]}
        intensity={6.0}
        penumbra={0.9}
        angle={0.6}
        shadow-mapSize={[4096, 4096]}
        shadow-bias={-0.001}
        castShadow={true}
      />

      {/*
      <e.spotLight
        theatreKey='light1'
        visible
        color={[1, 1, 1]}
        intensity={2.0}
        angle={0.6}
        penumbra={0.9}
        shadow-mapSize={[4096, 4096]}
        position={[2, 3, 0]}
        castShadow
        shadow-bias={-0.0005}
      />
      */}

      {/*
      <Environment resolution={512}>
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -9]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -3]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 3]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 6]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 9]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-50, 2, 0]} scale={[100, 2, 1]} />
        <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[50, 2, 0]} scale={[100, 2, 1]} />
      </Environment>
      */}

      <Environment
        background={false}
        resolution={512}
      >
        <Lightformer intensity={1} scale={[1, 5, 1]} target={[0, 0, 0]} position={[1, 1, 0]} />
        <Lightformer intensity={1.5} scale={[1, 1, 1]} target={[0, 0, 0]} position={[-3, 1, -3]} />
        <Lightformer intensity={3.5} scale={[4, 2, 1]} target={[0, 0, 0]} position={[-2, 1, 2]} />
        <Lightformer intensity={1} scale={[4, 2, 1]} target={[0, 0, 0]} position={[2, -2, -3]} />
      </Environment>
    </>
  )
}

export default Lights
