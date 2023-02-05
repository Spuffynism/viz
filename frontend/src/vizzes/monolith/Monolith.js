import { OrbitControls, useFBO, Float, useGLTF, Text, Text3D, Center } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { useMemo, useRef, Suspense, useContext } from 'react'
import * as THREE from 'three'

import vertexShader from '../refraction/vertexShader'
import fragmentShader from '../refraction/fragmentShader'
import { NowPlayingContext } from '../../NowPlayingContext'
import useCorners from '../shared/corners'

export default function Monolith() {
  const song = useContext(NowPlayingContext)
  return (
    <>
      <Canvas gl={{ antialias: true, stencil: false }} camera={{ position: [0, 0, 11], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={1.0} />
        <directionalLight position={[1, 5, 4]} intensity={4} />
        <Geometries song={song} />
      </Canvas>
    </>
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

  useFrame((state) => {
    const { gl, scene, camera } = state
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

  const shader = (
    <mesh ref={mesh} scale={.1} geometry={nodes.Monolith.geometry}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
        transparent={true}
      />
    </mesh>
  )

  return (
    <>
      <Suspense fallback={null}>
        <Float key={'first'} position={[-2.5, -.5, 0]}
               speed={2}
               rotationIntensity={4}
               floatIntensity={2}>
          {shader}
        </Float>
        <Float key={'second'} position={[0, .4, -1]} speed={2} rotationIntensity={4} floatIntensity={2}>
          {shader}
        </Float>
        <Float key={'third'} position={[2.5, 1, -2]} speed={2} rotationIntensity={4} floatIntensity={2}>
          {shader}
        </Float>
      </Suspense>
      <Text
        color={'black'}
        font={'SpaceGrotesk-Medium.ttf'}
        position={[0, 0, -4]}
        scale={10}
        rotation={[0, 0, 0]}>
        {song.title}
      </Text>
      <Center bottom right position={[corners.left, corners.top, 0]}>
        <Text
          color={'black'}
          font={'SpaceGrotesk-Medium.ttf'}
          scale={4}
          rotation={[0, 0, 0]}>
          {song.artist}
        </Text>
      </Center>
      <Center top left position={[corners.right, corners.bottom, 0]}>
        <Text
          color={'black'}
          font={'SpaceGrotesk-Medium.ttf'}
          scale={4}
          rotation={[0, 0, 0]}>
          {song.album}
        </Text>
      </Center>
    </>
  )
}
