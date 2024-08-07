import { useReflow } from '@react-three/flex'
import { useThree } from '@react-three/fiber'
import { normalizedExponentialDecay } from '../decay'
import { animated } from '@react-spring/three'
import { Text } from '@react-three/drei'

const AnimatedText = animated(Text)

function TText({ textLength, children, ...props }) {
  const reflow = useReflow()
  const { viewport } = useThree()
  return (
    <AnimatedText
      maxWidth={(viewport.width / 4) * 3}
      fontSize={normalizedExponentialDecay(textLength)}
      scale={1}
      onSync={reflow}
      {...props}>
      {children}
    </AnimatedText>
  )
}

export default TText;
