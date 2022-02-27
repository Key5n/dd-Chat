import HisCard from "./HisCard.js";
import { useContext, useEffect, useRef } from "react";
import { PeerContext, UserInformationContext, RoomContext } from "./VoiceChat.js"

function EngageCards({ roomNameRef, remoteAudio }) {
  const peerRef = useContext(PeerContext);
  const userInformation = useContext(UserInformationContext);
  const room = useContext(RoomContext);
  const userInformationExceptYou = userInformation.filter((user) => {
    return user.id !== peerRef.current.id;
  })

  const userList = userInformationExceptYou.map((user) => {
    return <li key={user.id}>
      <HisCard user={user} />
    </li>
  })
  const RemoteAudio = ({audio}) => {
    const audioRef = useRef(null)

    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.srcObject = audio.stream;
        audioRef.current.play().catch((e) => console.log(e));
      }
    }, [audio]);
    return(
      <audio ref={audioRef} muted={false} controls="controls" />
    )
  }
  const castAudio = () => {
    if(!remoteAudio) return;
    return remoteAudio.map((audio) => {
      return <RemoteAudio audio={audio} key={audio.peerId} />;
    })
  }

  return (
    <>
      <h2 className="room-name">Room {room && ": " + roomNameRef.current.value}</h2>
      <ul>{userList}</ul>
      <p>{(userInformation.length == 0 || userInformation.length == 1) && "誰もいません"}</p>
      {castAudio()}
    </>
  )
}

export default EngageCards; 