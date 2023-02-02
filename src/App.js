import {Canvas, useFrame, useThree} from '@react-three/fiber'
import { Center, Text3D, OrbitControls } from '@react-three/drei'
import {useControls} from "leva";
import {useState} from "react";

export default function App() {
  return (
    <Canvas orthographic camera={{ position: [0, 0, 100], zoom: 80 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} />
      <Scene />
      {/*<axesHelper scale={2} position={[0, 0, 0]} onUpdate={(self) => self.setColors('#ff2080', '#20ff80', '#2080ff')} />*/}
      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  )
}

function Scene({ margin = 0.5 }) {
  const song = {
    title: 'secret 1',
    artist: 'Magdalena Bay',
    album: 'Mercurial World (Deluxe)'
  }
  const { width, height } = useThree((state) => state.viewport)
  const position = {
    left: -width / 2 + margin,
    right: width / 2 - margin,
    top: height / 2 - margin,
    bottom: -height / 2 + margin,
  }

  const [rotation, setRotation] = useState([0,0,0])
  const [normalVisible, setNormalVisible] = useState(true)
  useFrame((state, delta) => {
    const angle = (state.clock.elapsedTime / 2) % (Math.PI * 2)
    setRotation([0, angle, 0])
    // 270 to 90
    setNormalVisible(angle < (Math.PI / 2) || angle > (Math.PI * 1.5))
  })

  return (
    <group rotation={rotation}>
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
