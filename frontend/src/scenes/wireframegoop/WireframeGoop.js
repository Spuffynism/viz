import { useSong } from '../../NowPlayingContext'
import { Canvas, useThree } from '@react-three/fiber'
import {
  Icosahedron,
  MeshDistortMaterial, OrbitControls, Plane,
  Text
} from '@react-three/drei'
import { animated, config, useSpring } from '@react-spring/three'
import { Box, Flex, useReflow } from '@react-three/flex'
import { EffectComposer, Noise } from '@react-three/postprocessing'

const AnimatedText = animated(Text)

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

export default function WireframeGoop() {
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
      <MovingBlob position={[0, 0, -10]} color={dots} speed={1.11} args={[10, 10]}/>
      <MovingBlob position={[-2, 2, 0]} color={dots} args={[1, 10]}/>
      <MovingBlob position={[-0.5, -2, -3]} color={dots} args={[1, 10]}/>
      <MovingBlob position={[-2, 1, -9.5]} color={dots} args={[0.5, 5]}/>
      <MovingBlob position={[2, 3, -8]} color={dots} args={[1, 10]}/>

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

const AnimatedMeshDistortMaterial = animated(MeshDistortMaterial)

const MovingBlob = ({color, speed = 1, ...props}) => {
  return (
    <Icosahedron args={[1, 15]} {...props}>
      <AnimatedMeshDistortMaterial
        color={color}
        speed={speed}
        distort={0.6}
        radius={1}
        wireframe
      />
    </Icosahedron>
  )
}
