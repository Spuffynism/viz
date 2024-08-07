import { useRef } from 'react'
import { useControls } from 'leva'

// const ControlledVignette = control(Vignette)

export function control(Component) {
  return (props) => {
    const ref = useRef(null)

    const mappedProps = Object.keys(props).map((prop) => {
      return {
        [prop]: {
          value: props[prop],
          onChange: (value) => {
            if (ref.current) {
              ref.current[prop] = value
            }
          }
        }
      }
    }).reduce((acc, v) => ({...acc, ...v}), {})

    const controlledProps = useControls(mappedProps);

    return <Component {...controlledProps} />
  }
}
