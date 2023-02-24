import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Center, Text3D } from '@react-three/drei'
import { useContext, useRef } from 'react'
import { NowPlayingContext } from '../../NowPlayingContext'
import { useSpring, animated, config } from '@react-spring/three'
import InfoText from '../shared/InfoText'
import useCorners from '../shared/corners'
import * as THREE from 'three'
import { EffectComposer, Vignette } from '@react-three/postprocessing'

export default function Spinning() {
  console.log('mount spinning')
  const { song } = useContext(NowPlayingContext)

  return (
    <Canvas orthographic camera={{ position: [0, 0, 100], zoom: 80 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} />
      <Scene song={song} />
      <gridHelper args={[100, 74, 'hotpink', '#9d9d9d']} position={[0, 0, -10]} rotation={[0, 1, -Math.PI / 4]} />
      <fog attach="fog" color="black" near={1} far={500} />
      <EffectComposer multisampling={0} disableNormalPass={true}>
        <Vignette eskil={false} offset={0.1} darkness={0.6} />
      </EffectComposer>
    </Canvas>
  )
}

function Scene({ margin = 0.5, song }) {
  const { width, height } = useThree((state) => state.viewport)
  const scene = useThree((state) => state.scene)
  scene.background = new THREE.Color('rgb(59,61,65)')
  const corners = useCorners({ width, height }, margin)

  const groupRef = useRef()
  const [artistRef, otherArtistRef, songRef, otherSongRef] = [useRef(), useRef(), useRef(), useRef()]
  useFrame((state, delta) => {
    const angle = (groupRef.current.rotation.y + (delta / 1.25)) % (Math.PI * 2)
    groupRef.current.rotation.y = angle

    // 270 to 90, when the text is vertical in the back, to when it's vertical in the front
    const normalVisible = angle < (Math.PI / 2) || angle > (Math.PI * 1.5)
    artistRef.current.visible = normalVisible
    songRef.current.visible = normalVisible
    otherArtistRef.current.visible = !normalVisible
    otherSongRef.current.visible = !normalVisible
  })

  return (
    <group ref={groupRef}>
      <InfoText bottom right position={[corners.left, corners.top, 0]} ref={artistRef}>
        {song.artist}
      </InfoText>
      <InfoText bottom left position={[corners.left, corners.top, 0]} rotation={[0, Math.PI, 0]} ref={otherArtistRef}>
        {song.artist}
      </InfoText>
      <InfoText top left position={[corners.right, corners.bottom, 0]} ref={songRef}>
        {song.album}
      </InfoText>
      <InfoText top right position={[corners.right, corners.bottom, 0]} rotation={[0, Math.PI, 0]} ref={otherSongRef}>
        {song.album}
      </InfoText>
      <Title>
        {song.title}
      </Title>
    </group>
  )
}

function Title({ children }) {
  const titleMesh = useRef()
  const { scale } = useSpring({
    from: { scale: [0, 0, 0] },
    to: { scale: [1, 1, 1] },
    leave: { scale: [0, 0, 0] },
    config: {duration: 5500, ...config.gentle},
  })

  return (
    <animated.mesh scale={scale} ref={titleMesh}>
      <Center rotation={[-0.30, -0.25, 0]}>
        <Text3D
          curveSegments={32}
          bevelEnabled
          bevelSize={0.04}
          bevelThickness={0.1}
          height={0.5}
          lineHeight={0.5}
          letterSpacing={-0.04}
          size={1}
          font='/Inter_Bold.json'>
          {children}
          <meshNormalMaterial />
        </Text3D>
      </Center>
    </animated.mesh>
  )
}
