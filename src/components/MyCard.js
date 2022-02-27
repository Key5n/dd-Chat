import { useState, useRef, useContext } from 'react'
import { RoomContext, PeerContext } from './VoiceChat';
import icon from './image/icon.svg';
import mic from './image/マイクアイコン.svg';
import micoff from './image/マイク消音アイコン.svg'
import headphone from './image/ヘッドフォンアイコン.svg';
import officon from './image/ヘッドフォンオフアイコン.png';

/*
  I, the author of this application, haven't added speaker off function
*/

function MyCard({localAudioRef, setUserInformation}) {
  const [isMuted, setIsMuted] = useState(true);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(true);
  const peerRef = useContext(PeerContext);
  const room = useContext(RoomContext);

  function RepresentMyName() {
    const [status, setStatus] = useState("display");
    const myNameInputRef = useRef(null);
    const [myName, setMyName] = useState(peerRef.current.id);

    function handleInputChange(e) {
      setMyName(e.target.value);
      return null;
    }

    function handleOnDoubleClickEvent(e) {
      if (room) {
        setStatus("editting");
      } else {
        alert("enter a room before edit your name")
      }
      //when you don't add set time out, myNameInput refers to nothing
      setTimeout(() => {
        myNameInputRef.current.focus();
      }, 50)
      return null;
    }

    function handleOnBlurEvent(e) {
      setStatus("display");
      room.send({
        type: 2,
        name: e.target.value,
      })

      setUserInformation((prev) => {
        return prev.map((user) => {
          if (user.id === peerRef.current.id) {
            user.name = myName;
          }
          return user;
        })
      })
      return null;

    }

    return (
      <>
        {status === "display" ?
          <p className="my-name"
            onDoubleClick={handleOnDoubleClickEvent}
          >
            {myName}
          </p> :
          <input value={myName}
            onChange={handleInputChange}
            onBlur={handleOnBlurEvent}
            ref={myNameInputRef}
            className="my-name-input"
          />
        }
      </>
    )
  }

  return (
    <div className="my-card">
      <audio ref={localAudioRef} muted={isMuted}></audio>
      <img src={icon} alt="icon" width="20%" />
      <RepresentMyName />
      {isMuted ? (
        <img src={micoff} alt="mic-icon" width="5%" style={{ marginRight: "2%" }} onClick={() => setIsMuted(!isMuted)} />
      ) : (
        <img src={mic} alt="mic-icon" width="5%" style={{ marginRight: "2%" }} onClick={() => setIsMuted(!isMuted)} />
      )}
      {isSpeakerMuted ? (
        <img src={officon} alt="speaker" width="5%" onClick={() => setIsSpeakerMuted(!isSpeakerMuted)} />
      ) : (
        <img src={headphone} alt="speaker" width="5%" onClick={() => setIsSpeakerMuted(!isSpeakerMuted)} />
      )}
    </div>
  )
}

export default MyCard;