import { useFBO, Float, useGLTF, Text, Center, Text3D } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { useMemo, useRef, useContext } from 'react'
import * as THREE from 'three'

import vertexShader from '../refraction/vertexShader'
import fragmentShader from '../refraction/fragmentShader'
import { NowPlayingContext } from '../../NowPlayingContext'
import useCorners from '../shared/corners'

export default function Monolith() {
  console.log('mount monolith')
  const song = useContext(NowPlayingContext)
  return (
    <Canvas gl={{ antialias: true, stencil: false }} camera={{ position: [0, 0, 11], fov: 50 }} dpr={[1, 2]}>
      <ambientLight intensity={1.0} />
      <directionalLight position={[1, 5, 4]} intensity={4} />
      <Geometries song={song} />
    </Canvas>
  )
}

const Geometries = ({ song }) => {
  const mesh = useRef()
  const scene = useThree((state) => state.scene)
  scene.background = new THREE.Color('#f1f1f5')
  const { width, height } = useThree((state) => state.viewport)
  const corners = useCorners({ width, height }, 0.5)
  const mainRenderTarget = useFBO()

  const { nodes } = useGLTF('shapes.gltf')

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSceneTex: { value: null },
    uTransparent: { value: .8 },
    uRefractPower: { value: .2 },
    color: { value: new THREE.Vector4 },
    winResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(Math.min(window.devicePixelRatio, 2))
    }
  }), [])

  const { refractPower, transparent } = useControls({
    refractPower: { value: .3, min: 0, max: 1, step: .01 },
    transparent: { value: .2, min: 0, max: 1, step: .01 }
  })

  useFrame(({ gl, scene, camera }) => {
    mesh.current.material.uniforms.winResolution.value =
      new THREE.Vector2(window.innerWidth, window.innerHeight)
        .multiplyScalar(Math.min(window.devicePixelRatio, 2))
    mesh.current.material.uniforms.uRefractPower.value = refractPower
    mesh.current.material.uniforms.uTransparent.value = transparent
    gl.setRenderTarget(mainRenderTarget)
    gl.render(scene, camera)
    mesh.current.material.uniforms.uSceneTex.value = mainRenderTarget.texture
    gl.setRenderTarget(null)
  })

  const items = [
    { key: 'first', position: [-2.5, -.5, 0] },
    { key: 'second', position: [0, .4, -1] },
    { key: 'third', position: [2.5, 1, -2] }
  ]

  return (
    <>
      {items.map(itemProps => (
          <Float speed={2} rotationIntensity={4} floatIntensity={2} {...itemProps}>
            <mesh ref={mesh} scale={.1} geometry={nodes.Monolith.geometry}>
              <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                wireframe={false}
                transparent={true}
              />
            </mesh>
          </Float>
        )
      )}
      <Center position={[0, 0, -4]}>
        <BlackText scale={6}>
          {song.title}
          <meshStandardMaterial color={'black'} />
        </BlackText>
      </Center>
      <Center bottom right position={[corners.left, corners.top, 0]}>
        <BlackText scale={4}>
          {song.artist}
          <meshStandardMaterial color={'black'} />
        </BlackText>
      </Center>
      <Center top left position={[corners.right, corners.bottom, 0]}>
        <BlackText scale={4}>
          {song.album}
          <meshStandardMaterial color={'black'} />
        </BlackText>
      </Center>
    </>
  )
}

const BlackText = ({children, ...props}) => (
  <Text3D
    height={0}
    letterSpacing={-0.01} size={0.1}
    font={'Space Grotesk Medium_Regular.json'}
    {...props}>
    {children}
  </Text3D>
)
