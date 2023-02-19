/*
width: 20%;
    height: 50%;
    position: fixed;
    margin-left: 80%;
 */
import { Leva } from 'leva'

const FadingControls = () => {
  return (
    <div className={'fading-controls'}>
      <Leva titleBar={false} neverHide={true} hidden={false} />
    </div>
  )
}

export default FadingControls;
