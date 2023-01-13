import React from "react"
import { Environment, Lightformer } from "@react-three/drei"
import { editable as e, SheetProvider, PerspectiveCamera } from "@theatre/r3f"

const Lights = () => {
  return (
    <>
      <e.spotLight
        theatreKey="light1"
        visible
        color={[1, 1, 1]}
        intensity={1}
        angle={0.6}
        penumbra={0.9}
        shadow-mapSize={[4000, 4000]}
        position={[2, 3, 0]}
        castShadow
        shadow-bias={-0.0005}
      />

      <Environment>
        <Lightformer form="rect" intensity={1} color="white" scale={[1, 5, 1]} target={[0, 0, 0]} position={[1, 1, 0]} castShadow />
        <Lightformer form="rect" intensity={1.5} color="white" scale={[1, 1, 1]} target={[0, 0, 0]} position={[-3, 1, -3]} castShadow />
        <Lightformer form="rect" intensity={3.5} color="white" scale={[4, 2, 1]} target={[0, 0, 0]} position={[-2, 1, 2]} castShadow />
        <Lightformer form="rect" intensity={1} color="white" scale={[4, 2, 1]} target={[0, 0, 0]} position={[2, -2, -1]} castShadow />
      </Environment>
    </>
  )
}

export default Lights
