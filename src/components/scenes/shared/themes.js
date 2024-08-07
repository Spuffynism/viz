'use client'

import { config, useSpring } from '@react-spring/three'

export const startTheme = {
  text: '#44348c',
  background: '#fef3e7',
  dots: '#f25042'
}

export const allThemes = [
  {
    text: '#ffffff',
    background: '#313131',
    dots: '#569AFF'
  },
  {
    text: '#ffffff',
    background: '#212121',
    dots: '#f25042'
  },
  {
    background: '#212121',
    text: '#faf1f4',
    dots: '#f345b1'
  },
]

export const useThemes = ({startTheme, themes}) => {
  return useSpring(() => ({
    from: startTheme,
    to: async (next, cancel) => {
      const promises = themes.map(async (theme, i) => {
        return new Promise((res) => setTimeout(() => res(theme), 60_000 * (i + 1)))
      })

      for (const promise of promises) {
        const res = await promise
        await next(res)
      }
    },
    loop: {
      reverse: true
    },
    config: config.molasses
  }), [])
}
