import { useContext, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AsciiRenderer, OrbitControls } from '@react-three/drei'
import { NowPlayingContext } from '../../NowPlayingContext'

export default function Ascii() {
  const { song } = useContext(NowPlayingContext)

  const characters = ' ' + song.title
  return (<>
    <Canvas camera={{ position: [0, 0, 1] }}>
      <color attach='background' args={['black']} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <TorusKnot />
      <OrbitControls />
      <AsciiRenderer fgColor='red' characters={characters} />
    </Canvas>
    <Overlay song={song} />
  </>)
}

function Overlay({ song }) {
  return (
    <div style={{
      position: 'absolute', top: '0.66em', left: '1em', fontSize: '50px', color: 'white', fontFamily: 'Space Mono'
    }}>
      {song.title}
      <br />
      {song.album}
      <br />
      {song.artist}
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
    <meshStandardMaterial color='orange' />
  </mesh>)
}
