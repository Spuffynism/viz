import { Leva } from 'leva'
import config from '../config'

const FadingControls = () => {
  return (
    <div className={'fading-controls'}>
      <Leva titleBar={false} neverHide={true} hidden={!config.showControls} />
    </div>
  )
}

export default FadingControls;
