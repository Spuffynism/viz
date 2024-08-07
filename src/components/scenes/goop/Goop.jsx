import { useSong } from '../../NowPlayingContext'
import { Canvas, useThree } from '@react-three/fiber'
import { Icosahedron, MeshDistortMaterial, OrbitControls, Plane } from '@react-three/drei'
import { animated } from '@react-spring/three'
import { Box, Flex } from '@react-three/flex'
import TText from '../shared/components/TText'
import { useThemes } from '../shared/themes'

import * as THREE from 'three';
import { useEffect } from 'react'

const AnimatedMeshDistortMaterial = animated(MeshDistortMaterial)

export default function Goop() {
  const song = useSong()

  const defaultTheme = {
    text: '#ffffff',
    background: '#313131',
    dots: '#f25042'
  }
  const themes = [
    {
      text: '#44348c',
      background: '#fef3e7',
      dots: '#f25042'
    },
    {
      ...defaultTheme,
      background: '#313131',
      dots: '#569AFF'
    },
    {
      ...defaultTheme,
      background: '#7AA874',
      dots: '#f65f52'
    },
    {
      ...defaultTheme,
      background: 'hotpink',
      dots: '#569AFF'
    }
  ]

  const [{ dots, background, text }] = useThemes({
    startTheme: defaultTheme,
    themes: themes,
  })

  return (
    <Canvas gl={{useLegacyLights: true}}>
      <OrbitControls />
      <pointLight position={[-10, -10, -10]} />
      <ambientLight intensity={1} />
      <Plane args={[100, 40]} position={[0,0,-10]}>
        <animated.meshStandardMaterial color={background} />
      </Plane>
      <MovingBlob position={[-8, -3, -2]} color={dots} speed={1.11}/>
      <MovingBlob position={[-3, 2, -2]} color={dots}/>
      <MovingBlob position={[0, -3, -3]} color={dots}/>
      <MovingBlob position={[4, 5, -2]} color={dots}/>
      <MovingBlob position={[6, -1, -2]} color={dots}/>

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
    </Canvas>
  )
}

const MovingBlob = ({color, speed = 1, ...props}) => {
  return (
    <Icosahedron args={[1, 15]} {...props}>
      <AnimatedMeshDistortMaterial
        color={color}
        speed={speed}
        distort={0.6}
        radius={1}
      />
    </Icosahedron>
  )
}
