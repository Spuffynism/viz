import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {Center, OrbitControls, Text3D} from "@react-three/drei";
import {useContext, useRef, useState} from "react";
import {NowPlayingContext} from "./NowPlayingContext";
import {useSpring, animated, config} from "@react-spring/three";

export default function SpinningViz() {
  const song = useContext(NowPlayingContext)
  return (
    <Canvas orthographic camera={{ position: [0, 0, 100], zoom: 80 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} />
      <Scene song={song} />
      {/*<axesHelper scale={2} position={[0, 0, 0]} onUpdate={(self) => self.setColors('#ff2080', '#20ff80', '#2080ff')} />*/}
      <OrbitControls enabled={false} enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  )
}

function Scene({ margin = 0.5 , song }) {
  const { width, height } = useThree((state) => state.viewport)
  const position = {
    left: -width / 2 + margin,
    right: width / 2 - margin,
    top: height / 2 - margin,
    bottom: -height / 2 + margin,
  }

  const groupRef = useRef();
  // TODO: If this causes performance issues, use useRef
  // See: https://docs.pmnd.rs/react-three-fiber/advanced/pitfalls#%E2%9C%85-instead,-just-mutate,-use-deltas
  const [normalVisible, setNormalVisible] = useState(true)
  useFrame((state, delta) => {
    const angle = (state.clock.elapsedTime / 2) % (Math.PI * 2)
    groupRef.current.rotation.y = angle
    // 270 to 90, when the text is vertical in the back, to when it's vertical in the front
    setNormalVisible(angle < (Math.PI / 2) || angle > (Math.PI * 1.5))
  })

  const titleMesh = useRef()
  const [active, setActive] = useState(false)
  const { scale } = useSpring({
    scale : active ? 0.75 : 1,
    config: config.wobbly
  })

  return (
    <group ref={groupRef}>
      <Center bottom right position={[position.left, position.top, 0]} visible={normalVisible}>
        <InfoText>
          {song.artist}
        </InfoText>
      </Center>
      <Center bottom left position={[position.left, position.top, 0]} rotation={[0, Math.PI, 0]} visible={!normalVisible}>
        <InfoText>
          {song.artist}
        </InfoText>
      </Center>
      <Center top right position={[position.right, position.bottom, 0]} rotation={[0, Math.PI, 0]} visible={!normalVisible}>
        <InfoText>
          {song.album}
        </InfoText>
      </Center>
      <Center top left position={[position.right, position.bottom, 0]} visible={normalVisible}>
        <InfoText>
          {song.album}
        </InfoText>
      </Center>
      <animated.mesh scale={scale} onClick={() => setActive(!active)} ref={titleMesh}>
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
            font="/Inter_Bold.json">
            {song.title}
            <meshNormalMaterial />
          </Text3D>
      </Center>
    </animated.mesh>
    </group>
  )
}

function InfoText({children}) {
  return (
    <Text3D letterSpacing={-0.01} size={0.5} font="/Inter_Bold.json">
      {children}
      <meshStandardMaterial color="white" />
    </Text3D>
  )
}
