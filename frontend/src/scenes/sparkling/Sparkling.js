import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import {
  Sparkles,
  Shadow,
  ContactShadows,
  Billboard,
  Environment,
  BakeShadows,
  OrbitControls,
  Text, Stars, Center, Text3D
} from '@react-three/drei'
import { LayerMaterial, Depth } from 'lamina'
import { useControls } from 'leva'
import config from '../../config'
import { useContext } from 'react'
import { NowPlayingContext, useSong } from '../../NowPlayingContext'
import useCorners from '../shared/corners'

export default function Sparkling({ env = 'construction_yard_4k.hdr' }) {
  const song = useSong()

  return (
    <Canvas shadows camera={{ position: [0, 0, 11], fov: 50 }} dpr={[1,2]} gl={{ antialias: true, stencil: false }}>
      <hemisphereLight intensity={0.5} color="white" groundColor="black" />
      <Environment files={env} ground={{ height: 5, radius: 30, scale: 20 }} />
      <Song song={song} />
      <ContactShadows renderOrder={2} color="black" resolution={1024} frames={1} scale={10} blur={1.5} opacity={0.65} far={0.5} />
      <BakeShadows />
      <OrbitControls autoRotateSpeed={0.85} zoomSpeed={0.75} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 2.55} />
    </Canvas>
  )
}

const Song = ({song}) => {

  const { position } = useControls({
    position: [0, 1, 3]
  })

  return (
    <>
      <Center position={position}>
        <SparklingText scale={5}>
          {song.title}
          {'\n'}
          {song.artist}
          {'\n'}
          {song.album}
        </SparklingText>
      </Center>
    </>
  )
}

const SparklingText = ({size = 1, position = [0,0,0], children, ...props}) => {
  const [x, y, z] = position

  // {/*<Sparkles count={100} scale={size * 2} size={12} speed={0.4} position={[x + 2, y, z]} />*/}

  return (
    <>
      <Text3D
        position={[x,y+0.05,z+0.1]}
        height={0.02}
        letterSpacing={0.01}
        size={0.1}
        font={'Barbie_MediumItalic.json'}
        strokeColor='#e0218a'
        {...props}
      >
        {children}
        <meshStandardMaterial color={'white'} />
      </Text3D>
      <Text3D
        position={[x, y, z-0.1]}
        height={0.05}
        letterSpacing={0.01}
        size={0.1}
        font={'Barbie_MediumItalic.json'}
        strokeColor='#e0218a'
        {...props}
      >
        {children}
        <meshStandardMaterial color={'#e0218a'} />
      </Text3D>
    </>
  )
}
