

function ManipulateRoom({roomEnterTrigger, roomLeaveTrigger, roomNameRef}) {
  return (
    <div className="manipulate-room">
      <input type="text" defaultValue="a" ref={roomNameRef} />
      <button onClick={roomEnterTrigger}>Enter</button>
      <button onClick={roomLeaveTrigger}>Leave</button>
    </div>
  )
}
export default ManipulateRoom;