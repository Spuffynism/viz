import { useSong } from '../../NowPlayingContext'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, OrbitControls, Plane } from '@react-three/drei'
import { animated } from '@react-spring/three'
import { Box, Flex } from '@react-three/flex'
import { useRef } from 'react'
import * as THREE from 'three'
import TText from '../shared/components/TText'
import { useThemes } from '../shared/themes'

const AnimatedMeshDistortMaterial = animated(MeshDistortMaterial)

export default function FullWireframe() {
  const song = useSong()

  const defaultTheme = {
    text: '#44348c',
    background: '#fef3e7',
    dots: '#f25042'
  }
  const themes = [
    {
      text: '#ffffff',
      background: '#313131',
      dots: '#569AFF'
    },
    {
      text: '#ffffff',
      background: '#212121',
      dots: '#f25042'
    },
    {
      background: '#212121',
      text: '#faf1f4',
      dots: '#f345b1'
    },
  ]

  const [{ dots, background, text }] = useThemes({
    startTheme: defaultTheme,
    themes
  })

  return (
    <Canvas gl={{useLegacyLights: true}}>
      <OrbitControls />
      <pointLight position={[-10, -10, -10]} />
      <ambientLight intensity={1} />
      <Plane args={[100, 40]} position={[0,0,-10]}>
        <animated.meshStandardMaterial color={background}/>
      </Plane>
      <MovingBlob position={[0, 0, 1]} color={dots} args={[5, 3]}/>

      <Flex justifyContent="center" alignItems="center" marginTop={1} marginRight={1}>
        <Box centerAnchor>
          <TText
            color={text}
            font='./VCGooperSemiCondensed-Black.woff'
            textLength={song.title.length + song.artist.length + song.album.length}
          >
            {song.title}
            {'\n'}
            {song.artist}
            {'\n'}
            {song.album}
          </TText>
        </Box>
      </Flex>
      {/* deactivate effect composer for next.js */}
      {/*<EffectComposer multisampling={0} disableNormalPass={true}>
        <Noise opacity={0.15} />
      </EffectComposer>*/}
    </Canvas>
  )
}

const MovingBlob = ({color, speed = 1, position, args}) => {
  const ref = useRef()
  useFrame(({ clock }, delta) => {
    if (!ref.current) {
      return
    }

    ref.current.rotation.x = ref.current.rotation.y += delta / 4
    const sin = parseInt(Math.sin(clock.getElapsedTime() * 0.5) * 50)
    const geometry = new THREE.IcosahedronGeometry(1, (sin > 0 ? sin : sin * -1) + 1)
    ref.current.geometry = geometry
  })

  return (
    <mesh position={position} ref={ref}>
      <AnimatedMeshDistortMaterial
        color={color}
        speed={speed}
        distort={0.65}
        radius={1}
        wireframe
      />
    </mesh>
  )
}
