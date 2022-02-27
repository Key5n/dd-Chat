import { useRef, useContext } from 'react'
import { RoomContext, PeerContext } from './VoiceChat';

function TextChat({ textContent, setTextContent, getUserName }) {
  const myTextInputRef = useRef(null);
  const peerRef = useContext(PeerContext);
  const room = useContext(RoomContext);
  async function onClick() {
    if (!room) {
      //forbid to send texts before entering room
      alert("Enter a room before sending texts.")
      return;
    }
    room.send({
      type: 1,
      body: myTextInputRef.current.value,
    })

    if (myTextInputRef.current.value) {
      return new Promise((resolve) => {
        //add texts
        setTextContent((prev) => {
          return [
            ...prev,
            <li>{getUserName(peerRef.current.id)} : {myTextInputRef.current.value}</li>,
          ]
        })
        resolve();
      }).then(() => {
        //clear the value of the input element
        myTextInputRef.current.value = "";
      })
    }
    return;
  }
  return (
    <>
      <div className="cp_actab">
        <input id="tab-two" type="checkbox" name="tabs" />
        <label htmlFor="tab-two">チャット欄</label>
        <div className="cp_actab-content">
          <div id="box">
            <pre className="messages">
              <ul>{textContent}</ul>
            </pre>
          </div>
        </div>
        <input type="text" />
      </div>
      <input type="text" ref={myTextInputRef} />
      <button onClick={onClick}>button</button>
    </>
  )
}

export default TextChat;