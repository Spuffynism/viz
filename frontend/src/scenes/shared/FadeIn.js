import { useRef } from 'react'
import { animated, config, useSpring } from '@react-spring/three'

const FROM = 500;

export default function FadeIn({ duration = 1000 }) {
  const fogMesh = useRef()
  const { near } = useSpring({
    from: { near: FROM },
    to: { near: 1 },
    leave: { near: FROM },
    config: {duration, ...config.gentle},
  })

  return (
    <animated.fog ref={fogMesh} attach="fog" args={['#17171b', FROM, 500]} near={near} />
  )
}
