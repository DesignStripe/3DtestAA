import React, { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { getProject, types } from '@theatre/core'
import { SheetProvider, PerspectiveCamera } from '@theatre/r3f'
import studio from '@theatre/studio'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, SMAA } from '@react-three/postprocessing'

const NO_AA = 0
const MS_AA = 1
const SM_AA = 2

// Note: There appears to be no obvious way of connecting studio sheet object data to non-r3f components.
const sceneCSheet = getProject('3D Mockup').sheet('SceneC')
const multisampling = sceneCSheet.object(
  'multisampling',
  {
    method: types.stringLiteral(
      NO_AA, { NOAA: 'No AA', MSAA: 'MSAA', SMAA: 'SMAA' }
    ),
    // Note: nudgeMultiplier doesn't work
    // level: types.number(0, { range: [0, 8], nudgeMultiplier: 0.5 })
    levelNotWorking: types.number(0, { range: [0, 8],
      nudgeFn: obj => Math.sign(obj.deltaX) * obj.magnitude
    }),
    level: types.stringLiteral(
      0, { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 8: '8'}
    )
  }
)

console.log(multisampling, multisampling.props)

const lines = new Float32Array([-0.18400000035762787,-0.24899999797344208,2.763000011444092,2.115000009536743,3.510999917984009,-2.053999900817871,-4.539000034332275,-0.9570000171661377,-3.075000047683716,4.755000114440918,0.8199999928474426,-1.0700000524520874,-3.1600000858306885,-3.1519999504089355,-2.2170000076293945,2.450000047683716,-2.6429998874664307,-1.0210000276565552,-2.5399999618530273,4.006999969482422,4.564000129699707,1.9509999752044678,3.3340001106262207,-1.1990000009536743,-2.1679999828338623,3.315999984741211,2.941999912261963,-4.605000019073486,4.210000038146973,-2.7360000610351562,1.6200000047683716,3.058000087738037,-4.941999912261963,1.0390000343322754,2.51200008392334,2.509000062942505,3.6050000190734863,-2.380000114440918,-2.7980000972747803,0.824999988079071,-2.6610000133514404,-2.7760000228881836,3.630000114440918,4.7270002365112305,4.894999980926514,3.427000045776367,0.8619999885559082,2.7309999465942383,-2.7149999141693115,3.4230000972747803,4.5960001945495605,0.6850000023841858,-0.15700000524520874,-1.2699999809265137,1.1920000314712524,-4.623000144958496,4.925000190734863,0.3799999952316284,0.8519999980926514,-1.7929999828338623,2.556999921798706,-3.197000026702881,-0.6209999918937683,-3.6510000228881836,0.010999999940395355,0.3580000102519989,0.01600000075995922,-2.2160000801086426,-0.9399999976158142,-2.1630001068115234,4.421000003814697,4.51200008392334,-3.7920000553131104,2.197000026702881,1.7740000486373901,4.894000053405762,1.687999963760376,3.640000104904175,2.2149999141693115,-3.7869999408721924,-0.9739999771118164,3.822999954223633,0.9010000228881836,-1.7999999523162842,-0.45899999141693115,3.3959999084472656,-4.705999851226807,1.7719999551773071,-0.5490000247955322,-2.697000026702881,0.609000027179718,-4.752999782562256,1.8329999446868896,-2.049999952316284,-1.3170000314712524,2.6630001068115234,-0.10999999940395355,3.63100004196167,-0.6449999809265137,4.168000221252441,2.7100000381469727,-2.0439999103546143,-4.248000144958496,3.8580000400543213,-2.4690001010894775,0.3970000147819519,-2.062000036239624,4.548999786376953,-2.1050000190734863,0.9190000295639038,1.1230000257492065,4.9079999923706055,2.316999912261963,4.5279998779296875,-4.083000183105469,4.125999927520752,0.7960000038146973,1.1260000467300415,4.039999961853027,4.586999893188477,0.7170000076293945,2.7660000324249268,-3.566999912261963,-2.188999891281128,-4.135000228881836,3.134000062942505,1.3240000009536743,1.5640000104904175,2.5950000286102295,-1.3259999752044678,0.035999998450279236,-0.949999988079071,-4.809999942779541,3.312000036239624,-3.3480000495910645,3.9590001106262207,-3.249000072479248,1.2489999532699585,0.35600000619888306,2.3289999961853027,1.0820000171661377,-3.259000062942505,-0.8659999966621399,-1.0670000314712524,-3.4690001010894775,4.9039998054504395,-1.8530000448226929,2.0169999599456787,-0.6970000267028809,4.381999969482422,0.6740000247955322,-0.4580000042915344,4.355000019073486,-1.75,3.7690000534057617,-3.984999895095825,-4.4029998779296875,-2.1579999923706055,-0.06599999964237213,3.5490000247955322,-1.9980000257492065,-0.26100000739097595,-2.2330000400543213,-2.421999931335449,-4.697000026702881,1.7869999408721924,2.4230000972747803,1.093000054359436,-1.7630000114440918,-2.7060000896453857,3.8580000400543213,1.86899995803833,-1.8270000219345093,-4.618000030517578,-2.6449999809265137,-2.010999917984009,2.565999984741211,3.98799991607666,-2.4159998893737793,-2.5,2.5160000324249268,-2.6589999198913574,2.752000093460083,-3.503999948501587,3.9769999980926514,0.8529999852180481,-4.4029998779296875,-1.9529999494552612,2.0929999351501465,-3.247999906539917,-1.4170000553131104,-4.86299991607666,4.802000045776367,3.7909998893737793,1.9329999685287476,2.5769999027252197,-1.3020000457763672,-1.88100004196167,1.6399999856948853,-0.4950000047683716,2.7209999561309814,-0.13300000131130219,-3.4070000648498535,-2.8980000019073486,4.1529998779296875,-1.3589999675750732,2.0190000534057617,4.085000038146973,-2.368000030517578,4.425000190734863,-1.878000020980835,-4.144000053405762,-2.756999969482422,-1.7869999408721924,-0.33799999952316284,1.815999984741211,-2.0320000648498535,-4.764999866485596,-0.6919999718666077,1.5709999799728394,-3.115000009536743,0.40400001406669617,0.3610000014305115,0.503000020980835,3.8970000743865967,-1.5019999742507935,-1.3480000495910645,1.6480000019073486,3.010999917984009,1.8489999771118164,1.5119999647140503,0.8100000023841858,4.5289998054504395,-0.008999999612569809,-3.2679998874664307,3.2850000858306885,3.01200008392334,0.7919999957084656,1.475000023841858,-0.9900000095367432,4.857999801635742,-2.312000036239624,-4.953999996185303,3.609999895095825,4.085999965667725,-3.5220000743865967,4.401000022888184,-3.8299999237060547,2.3540000915527344,0.824999988079071,-3.8970000743865967,0.921999990940094,4.464000225067139,3.549999952316284,-2.0759999752044678,3.6470000743865967,1.878000020980835,-0.7919999957084656,3.183000087738037,3.6419999599456787,-0.9070000052452087,-3.625999927520752,0.921999990940094,-2.503999948501587,2.25600004196167,1.1670000553131104,3.3410000801086426,1.5540000200271606,2.4030001163482666,-2.109999895095825,4.64300012588501,-4.671999931335449,-2.1659998893737793,0.5149999856948853,-2.490999937057495,-1.7740000486373901,2.24399995803833,2.5920000076293945,0.4300000071525574,-3.805000066757202,-0.7289999723434448,-0.7590000033378601,-1.7589999437332153,1.9789999723434448,0.7009999752044678,-4.151000022888184,2.434999942779541,4.639999866485596,1.9600000381469727,-4.785999774932861,-4.593999862670898,4.872000217437744,-3.328000068664551,0.38100001215934753,-1.4600000381469727,3.311000108718872,-2.5280001163482666,-0.8240000009536743,-0.24500000476837158,0.4390000104904175])

/*
// Generate a set of random points for lines

const rnd = (min, max) => Math.random() * (max - min) + min

const lineCount = 300
console.assert(lineCount % 3 === 0)
const lines = new Float32Array(lineCount)
for(let i = 0; i < lineCount; i += 3) {
  lines[i] = rnd(-5, 5)
  lines[i+1] = rnd(-5, 5)
  lines[i+2] = rnd(-5, 5)
}
*/

const Lines = () => {
  const bufferRef = useRef(null)

  useEffect(() => {
    if(bufferRef.current != null) {
      bufferRef.current.setAttribute('position', new THREE.BufferAttribute(lines, 3))
    }
  }, [bufferRef])

  return (
    <lineSegments position={[0, 0, 0]}>
      <bufferGeometry ref={bufferRef}/>
      <meshBasicMaterial args={[{ color: 'white'}]} />
    </lineSegments>
  )
}

function Postprocess ({ method, level }) {
  const ref = useRef(null)

  useEffect(() => ref.current && console.log('ms:', ref.current.multisampling), [ref])

  return (
    <EffectComposer multisampling={method === 1 ? level : 0} ref={ref}>
      {method === 2 ? <SMAA preset={level} /> : undefined }
    </EffectComposer>
  )
}

const SceneC = () => {
  useEffect(() => studio.ui.restore(), [])

  return (
    <>
      <div style={{ backgroundColor: 'black', height: '100vh' }}>
        <Canvas
          gl={{ preserveDrawingBuffer: true }}
          dpr={window.devicePixelRatio}>
          <SheetProvider sheet={sceneCSheet}>
            <OrbitControls target={[0, 0, 0]} />
            <PerspectiveCamera theatreKey='Camera' makeDefault position={[0, 0, 15]} fov={45} />
            <Lines />
            {/* Note: refresh when changing these values! */}
            <Postprocess method={MS_AA} level={8} />
          </SheetProvider>
        </Canvas>
      </div>
    </>
  )
}

export default SceneC
