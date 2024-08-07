'use client';

import { useContext, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { NowPlayingContext } from '../../NowPlayingContext'
import { useControls } from 'leva'
import { AsciiEffect } from 'three-stdlib'

export default function Ascii() {
  const { song } = useContext(NowPlayingContext);

  const characters = ' ' + song.title;
  const {x, y, z} = useControls({
    x: -10,
    y: -10,
    z: -10
  })
  return (<>
    <Canvas camera={{ position: [0, 0, 1] }} gl={{useLegacyLights: true}}>
      <color attach='background' args={['black']} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <TorusKnot />
      <OrbitControls />
      <AsciiRenderer fgColor='red' characters={characters} />
    </Canvas>
    <Overlay song={song} />
  </>)
}

function Overlay({ song }) {
  return (
    <div style={{
      position: 'absolute', top: '0.66em', left: '1em', fontSize: '50px', color: 'white', fontFamily: 'Space Mono'
    }}>
      {song.title}
      <br />
      {song.album}
      <br />
      {song.artist}
    </div>
  )
}

function TorusKnot() {
  const ref = useRef()
  useFrame((state, delta) => {
    ref.current.rotation.x = ref.current.rotation.y += delta / 4
  })
  return (<mesh
    ref={ref}>
    <torusKnotGeometry args={[1, 0.2, 128, 32]} />
    <meshStandardMaterial color='orange' />
  </mesh>)
}

function AsciiRenderer({
                         renderIndex = 1,
                         characters = " .:-+*=%@#",
                         bgColor = "black",
                         fgColor = "white",
                         invert = true,
                         color = false,
                         resolution = 0.175
                       }) {
  // Reactive state
  const { size, gl, scene, camera } = useThree();

  // Create effect
  const effect = useMemo(() => {
    const effect = new AsciiEffect(gl, characters, {
      invert,
      color,
      resolution
    });
    effect.domElement.style.position = "absolute";
    effect.domElement.style.top = "0px";
    effect.domElement.style.left = "0px";
    effect.domElement.style.pointerEvents = "none";
    return effect;
  }, [characters, invert, color, resolution]);

  // Styling
  useLayoutEffect(() => {
    effect.domElement.style.color = fgColor;
    effect.domElement.style.backgroundColor = bgColor;
  }, [fgColor, bgColor, characters]);

  // Append on mount, remove on unmount
  useEffect(() => {
    gl.domElement.style.opacity = "0";
    gl.domElement.parentNode.appendChild(effect.domElement);
    return () => {
      gl.domElement.style.opacity = "1";
      gl.domElement.parentNode.removeChild(effect.domElement);
    };
  }, [effect]);

  // Set size
  useEffect(() => {
    effect.setSize(size.width, size.height);
  }, [effect, size]);

  // Take over render-loop (that is what the index is for)
  useFrame((state) => {
    effect.render(scene, camera);
  }, renderIndex);

  // This component returns nothing, it is a purely logical
  return null;
}

