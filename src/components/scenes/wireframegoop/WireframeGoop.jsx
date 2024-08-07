import { useSong } from '../../NowPlayingContext'
import { Canvas } from '@react-three/fiber'
import { Icosahedron, MeshDistortMaterial, OrbitControls, Plane } from '@react-three/drei'
import { animated } from '@react-spring/three'
import { Box, Flex } from '@react-three/flex'
import { EffectComposer, Noise } from '@react-three/postprocessing'
import TText from '../shared/components/TText'
import { useThemes } from '../shared/themes'

export default function WireframeGoop() {
  const song = useSong()
  const startTheme = {
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
    startTheme,
    themes,
  })

  return (
    <Canvas gl={{useLegacyLights: true}}>
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
