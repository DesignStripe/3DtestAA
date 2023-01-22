import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Root from './Root'
import studio from "@theatre/studio"
import extension from "@theatre/r3f/dist/extension"
import SceneA from "./components/scenes/sceneA/index.jsx"
import SceneB from "./components/scenes/sceneB/index.jsx"
import SceneC from "./components/scenes/sceneC/index.jsx"

studio.initialize()
studio.extend(extension)
studio.ui.hide()

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />
  },
  {
    path: '/sceneA',
    element: <SceneA />
  },
  {
    path: '/sceneB',
    element: <SceneB />
  },
  {
    path: '/sceneC',
    element: <SceneC />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
