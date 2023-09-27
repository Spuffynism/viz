import { useSong } from '../../NowPlayingContext'
import { Canvas, invalidate, useFrame, useThree } from '@react-three/fiber'
import {
  Icosahedron,
  MeshDistortMaterial, OrbitControls, Plane,
  Text
} from '@react-three/drei'
import { animated, config, useSpring } from '@react-spring/three'
import { Box, Flex, useReflow } from '@react-three/flex'
import { EffectComposer, Noise } from '@react-three/postprocessing'
import { useControls } from 'leva'
import { useRef } from 'react'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

const AnimatedText = animated(Text)
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

  const [{ dots, background, text }] = useSpring(() => ({
    from: defaultTheme,
    to: async (next, cancel) => {
      const promises = themes.map(async (theme, i) => {
        return new Promise((res) => setTimeout(() => res(theme), 60_000 * (i + 1)))
      })

      for (const promise of promises) {
        const res = await promise
        await next(res)
      }
    },
    loop: {
      reverse: true
    },
    config: config.molasses
  }), [])

  // 313131
  // ffff7f
  // <Canvas camera={{ position: [0,0, 0], zoom: 0.1 }}> looks fun
  // orthographic camera={{ position: [0,0, 100], zoom: 150 }} works but isn't _quite_ right
  // this light config is fun:
  /*
  <pointLight position={[-10, -10, -10]} />
      <pointLight position={[0, 0, 0]} />
      {/*<ambientLight intensity={1} />
   */
  return (
    <Canvas>
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
            font='./6392477d42bd66577724519a_VCGooperSemiCondensed-Black.woff'
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
      <EffectComposer multisampling={0} disableNormalPass={true}>
        <Noise opacity={0.15} />
      </EffectComposer>
    </Canvas>
  )
}

const normalizedExponentialDecay = (x) => {
  return Math.E ** (-1 * (x / 150))
}

function TText({ textLength, children, ...props }) {
  const reflow = useReflow()
  const { viewport } = useThree()
  return (
    <AnimatedText
      maxWidth={(viewport.width / 4) * 3}
      fontSize={normalizedExponentialDecay(textLength)}
      scale={1}
      onSync={reflow}
      {...props}>
      {children}
    </AnimatedText>
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
