import { forwardRef } from 'react'
import { Center, Text3D } from '@react-three/drei'

const InfoText = forwardRef(({ children, color = 'white', font = '/Inter_Bold.json', ...props }, ref) => {
  return (
    <Center {...props} ref={ref}>
      <Text3D letterSpacing={-0.01} size={0.5} font={font}>
        {children}
        <meshStandardMaterial color={color} />
      </Text3D>
    </Center>
  )
})

export default InfoText
