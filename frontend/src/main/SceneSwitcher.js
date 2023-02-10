import FadingControls from './FadingControls'
import { useControls } from 'leva'

const SceneSwitcher = ({ scenes, activeScene }) => {
  const { scene } = useControls({
    scene: { options: Object.keys(scenes), value: activeScene }
  })

  return (
    <>
      <FadingControls />
      {scenes[scene]}
    </>
  )
}

export default SceneSwitcher;
