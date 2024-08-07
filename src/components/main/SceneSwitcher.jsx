import FadingControls from './FadingControls'
import { useControls } from 'leva'
import { useContext, useEffect, useState } from 'react'
import { NowPlayingContext } from '../NowPlayingContext'

const SceneSwitcher = ({ scenes, changeWithSong = false, startScene = null }) => {
  const sceneMap = scenes.reduce((acc, v) => ({ ...acc, [v.name]: v }), {})
  const sceneNames = Object.keys(sceneMap)
  const [activeScene, setActiveScene] = useState(startScene || sceneNames[0])

  const { song } = useContext(NowPlayingContext)

  const [{ scene }, set] = useControls(() => ({
    scene: { options: sceneNames, value: activeScene }
  }))

  useEffect(() => {
    if (!changeWithSong) {
      return
    }

    const scene = nextScene(sceneNames, activeScene)
    setActiveScene(scene)

    set({ scene })
  }, [song, activeScene, changeWithSong, sceneNames, set])

  const Scene = sceneMap[scene]

  return (
    <>
      {/* The control component somehow doesn't work with the switch to next.js. Need to figure out why. */}
      {/*<FadingControls />*/}
      <Scene />
    </>
  )
}

const nextScene = (sceneNames, activeScene) => {
  const currentScenePosition = sceneNames.indexOf(activeScene)
  const nextScenePosition = (currentScenePosition + 1) % sceneNames.length

  return sceneNames[nextScenePosition]
}

export default SceneSwitcher;
