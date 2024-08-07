'use client';
import { Leva } from 'leva'
import config from '../config'

const FadingControls = () => {
  return (
    <Leva titleBar={false} neverHide={true} hidden={!config.showControls} />
  )
}

export default FadingControls;
