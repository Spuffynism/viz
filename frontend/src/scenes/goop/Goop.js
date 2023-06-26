import { useSong } from '../../NowPlayingContext'
import { Canvas, useThree } from '@react-three/fiber'
import {
  Center,
  Icosahedron,
  MeshDistortMaterial, Plane,
  Text
} from '@react-three/drei'
import { useControls } from 'leva'
import { animated, config, useSpring } from '@react-spring/three'
import * as THREE from 'three'

const AnimatedText = animated(Text)
const AnimatedPlane = animated(Plane)

export default function Goop() {
  const song = useSong()

  const defaultTheme = {
    text: '#ffffff',
    background: '#616161',
    dots: '#f25042'
  }
  const themes = [
    defaultTheme,
    {
      text: '#44348c',
      background: '#fef3e7',
      dots: '#f25042'
    },
    {
      ...defaultTheme,
      dots: '#569AFF'
    },
    {
      ...defaultTheme,
      background: '#008000'
    },
    {
      ...defaultTheme,
      background: 'hotpink',
      dots: '#569AFF'
    }
  ]
  const {theme} = useControls({theme: {
    value: 0,
    min: 0,
    max: themes.length - 1,
    step: 1
  }})

  const [{ dots, background, text }] = useSpring(() => ({
    from: defaultTheme,
    to: async (next, cancel) => {
      const promises = themes.map(async (theme, i) => {
        return new Promise((res) => setTimeout(() => res(theme), 30_000 * (i + 1)))
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
  return (
    <Canvas>
      <ambientLight intensity={1} />
      <Plane args={[200, 40]} position={[0,0,-10]}>
        <animated.meshStandardMaterial color={background} />
      </Plane>
      <MovingBlob position={[-8, -3, -2]} color={dots}/>
      <MovingBlob position={[-3, 2, -2]} color={dots}/>
      <MovingBlob position={[0, -3, -3]} color={dots}/>
      <MovingBlob position={[4, 5, -2]} color={dots}/>
      <MovingBlob position={[6, -1, -2]} color={dots}/>

      <Center>
        <AnimatedText
          color={text}
          font='./6392477d42bd66577724519a_VCGooperSemiCondensed-Black.woff'
          fontSize={1}
        >
          {song.title}
          {'\n'}
          {song.artist}
          {'\n'}
          {song.album}
        </AnimatedText>
      </Center>
    </Canvas>
  )
}

const AnimatedMeshDistortMaterial = animated(MeshDistortMaterial)

const MovingBlob = ({color, ...props}) => {
  return (
    <Icosahedron args={[1, 15]} {...props}>
      <AnimatedMeshDistortMaterial
        color={color}
        speed={1}
        distort={0.6}
        radius={1}
      />
    </Icosahedron>
  )
}
