import { OrbitControls, useFBO, Float, useGLTF, Text } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { useMemo, useRef, Suspense, useContext } from 'react'
import * as THREE from 'three'

import vertexShader from './vertexShader'
import fragmentShader from './fragmentShader'
import { NowPlayingContext } from '../../NowPlayingContext'

export default function Refraction() {
  console.log('mount refraction')
  const song = useContext(NowPlayingContext)
  return (
    <>
      <Canvas gl={{ antialias: true, stencil: false }} camera={{ position: [0, 0, 11], fov: 25 }} dpr={[1, 2]}>
        <OrbitControls />
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
    transparent: { value: .5, min: 0, max: 1, step: .01 }
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

  return (
    <>
      <Suspense fallback={null}>
        <Float
          position={[-1.5, -1, 0]}
          speed={2}
          rotationIntensity={4}
          floatIntensity={2}>
          <mesh ref={mesh} scale={.1} geometry={nodes.Cube.geometry}>
            <shaderMaterial
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={uniforms}
              wireframe={false}
              transparent={true}
            />
          </mesh>
        </Float>
        <Float position={[2.7, 1, -2]} speed={2} rotationIntensity={4} floatIntensity={2}>
          <mesh ref={mesh} scale={.1} geometry={nodes.Cylinder.geometry}>
            <shaderMaterial
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={uniforms}
              wireframe={false}
              transparent={true}
            />
          </mesh>
        </Float>
        <Float position={[.8, .4, -1]} speed={2} rotationIntensity={4} floatIntensity={2}>
          <mesh ref={mesh} scale={.1} geometry={nodes.Torus.geometry}>
            <shaderMaterial
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={uniforms}
              wireframe={false}
              transparent={true}
            />
          </mesh>
        </Float>
        <Float position={[0, 0, -2]} speed={2} rotationIntensity={2} floatIntensity={2}>
          <mesh position={[0, 2, -2]} scale={1}>
            <sphereGeometry/>
            <meshStandardMaterial color={new THREE.Color('#FFFFFF')}/>
          </mesh>
        </Float>
      </Suspense>
      <Text
        color={'black'}
        font={'SpaceGrotesk-Medium.ttf'}
        position={[0, 0, -4]}
        scale={10}
        rotation={[0, 0, Math.PI / 8]}
      >
        {song.title}
      </Text>
    </>
  )
}
