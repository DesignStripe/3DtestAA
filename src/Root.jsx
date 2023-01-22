import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import studio from '@theatre/studio'

function Root () {
  useEffect(() => studio.ui.hide(), [])

  return (
    <>
      <div style={{
        backgroundColor: 'black',
        height: '100vh',
        margin: 0,
        padding: 0,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <ul style={{}}>
          <li><Link to='/sceneA'>Scene A - original</Link></li>
          <li><Link to='/sceneB'>Scene B - sRGB</Link></li>
          <li><Link to='/sceneC'>Scene C - MSAA test</Link></li>
        </ul>
      </div>
    </>
  )
}

export default Root
