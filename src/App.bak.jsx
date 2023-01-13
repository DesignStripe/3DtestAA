import React, { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { getProject } from "@theatre/core"
import studio from "@theatre/studio"
import extension from "@theatre/r3f/dist/extension"
import { editable as e, SheetProvider, PerspectiveCamera } from "@theatre/r3f"

studio.initialize()
studio.extend(extension)
const demoSheet = getProject("Demo Project").sheet("Demo Sheet")

const App = () => {
  return (
    <div style={{ bg: "black", height: "100vh" }}>
      <Canvas gl={{ preserveDrawingBuffer: true }}>
        <SheetProvider sheet={demoSheet}>
          <PerspectiveCamera theatreKey="Camera" makeDefault position={[1, 1, 1]} fov={75} />
          <ambientLight />
          <e.pointLight theatreKey="Light" position={[10, 10, 10]} />
          <e.mesh theatreKey="Cube">
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
          </e.mesh>
        </SheetProvider>
      </Canvas>
    </div>
  )
}

export default App
