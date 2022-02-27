import {RoomContext} from './VoiceChat'
import {useContext} from 'react'
function SubmitMorse({play, stop }) {
  const room = useContext(RoomContext)

  function onMouseDownSendSignal() {
    if (room) {
      room.send({
        type: 4,
        signal: true,
      })
    }
    play();
    console.log("playing")
    return;
  }
  function onMouseUpStopSignal() {
    if (room) {
      room.send({
          type: 4,
          signal: false,
      })
    }
    stop();
    console.log("stopped")
    return;
  }
  return (
    <button onMouseDown={onMouseDownSendSignal} onMouseUp={onMouseUpStopSignal} onMouseOut={onMouseUpStopSignal}>
      モールス信号
    </button>
  )
}
export default SubmitMorse;