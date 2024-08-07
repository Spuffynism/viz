'use client';

import { Fragment, useContext, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AsciiRenderer, OrbitControls } from '@react-three/drei'
import { NowPlayingContext } from '../../NowPlayingContext'
import { useControls } from 'leva'

export default function Torus() {
  const { song } = useContext(NowPlayingContext)

  const characters = ' ()'
  return (<>
    <Canvas camera={{ position: [0, 0, 1] }} gl={{useLegacyLights: true}}>
      <color attach="background" args={['black']} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <TorusKnot />
      <OrbitControls />
      <AsciiRenderer fgColor="white" characters={characters} />
    </Canvas>
    <Overlay song={song} />
  </>)
}

function Overlay({ song }) {
  return (
    <div style={{
      top: '50%',
      left: '50%',
      position: 'absolute',
      fontSize: '150px',
      color: 'white',
      fontFamily: 'Space Mono',
      transform: 'translate(-50%, -50%)'
    }}>
      <div style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        marginBottom: '-320px'
      }}>
          <span style={{
            background: `linear-gradient(to top, transparent 50%, white 50%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            (((({song.title.toUpperCase().replace(/\s/g, '').substring(0, 6)}))))
          </span>
      </div>
      <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
        <span>;;;;;;-\</span>
      </div>
      <br style={{ display: 'block', margin: '1px 0' }} />
      <div style={{ fontSize: '50px', backgroundColor: 'black', width: 'fit-content' }}>
        {song.title.toUpperCase()}
      </div>
      <div style={{ fontSize: '50px', backgroundColor: 'black', width: 'fit-content' }}>
        {song.artist.toUpperCase()}
      </div>
      <div style={{ fontSize: '50px', backgroundColor: 'black', width: 'fit-content' }}>
        {song.album.toUpperCase()}
      </div>
    </div>
  )
}

function TorusKnot() {
  const ref = useRef()
  useFrame((state, delta) => {
    ref.current.rotation.x = ref.current.rotation.y += delta / 4
  })
  return (<mesh
    ref={ref}>
    <torusKnotGeometry args={[1, 0.2, 128, 32]} />
    <meshStandardMaterial color="orange" />
  </mesh>)
}
