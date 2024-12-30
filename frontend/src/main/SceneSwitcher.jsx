import FadingControls from './FadingControls'
import { useControls } from 'leva'
import { useContext, useEffect, useMemo, useState } from 'react'
import { NowPlayingContext } from '../NowPlayingContext'

const SceneSwitcher = ({ scenes, changeWithSong = false, startScene }) => {
  const sceneMap = scenes.reduce((acc, v) => ({ ...acc, [v.name]: v }), {})
  const sceneNames = useMemo(() => Object.keys(sceneMap), [scenes])
  const [activeScene, setActiveScene] = useState(startScene)

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
    console.log('Setting active scene to', scene)

    set({ scene })
  }, [song, changeWithSong, sceneNames, set])

  const Scene = sceneMap[scene]

  return (
    <>
      <FadingControls />
      <Scene />
    </>
  )
}

const nextScene = (sceneNames, activeScene) => {
  const currentScenePosition = sceneNames.indexOf(activeScene)
  const nextScenePosition = (currentScenePosition + 1) % sceneNames.length

  return sceneNames[nextScenePosition]
}

export default SceneSwitcher
