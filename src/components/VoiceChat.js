import React, { useRef, useEffect, useState, createContext } from "react";
import Peer from "skyway-js";
import MyCard from "./MyCard.js"
import TextChat from "./TextChat.js"
import MorseCode from "./MorseCode.js"
import SubmitMorse from "./SubmitMorse.js"
import ManipulateRoom from "./ManipulateRoom.js"
import EngageCards from "./EngageCards.js"
import useSound from 'use-sound';
import audioFile from "./assets/600Hz.wav"

export const UserInformationContext = createContext([]);
export const RoomContext = createContext();
export const PeerContext = createContext();

function VoiceChat() {

  const peerSettings = {
    key: "6471d28c-8a60-4ed5-a59a-1c5aab458fee",
    debug: 3
  }
  const constraints = {
    audio: true,
    video: false,
  }
  const peerRef = useRef(new Peer(peerSettings));

  // store the room's name
  const [room, setRoom] = useState(null);

  //store my media stream
  const [localStream, setLocalStream] = useState([]);

  //refer to my audio element
  const localAudioRef = useRef(null);

  //store information of people in the room
  const [userInformation, setUserInformation] = useState([]);

  //set audios
  const [remoteAudio, setRemoteAudio] = useState([]);

  //whether morse tone is playing or not
  const [isPlaying, setIsPlaying] = useState(false);

  //refer to input element that store the room's name
  const roomNameRef = useRef(null);

  const [play, { stop }] = useSound(audioFile);
  const [textContent, setTextContent] = useState([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      setLocalStream(stream);
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
        localAudioRef.current.muted = true;
        localAudioRef.current.play().catch((e) => console.log(e));
      }
    }).catch((e) => {
      console.log(e);
    });
  }, []);

  const roomEnterTrigger = () => {
    if (!peerRef.current.open) {
      //if can't connect with skyway, forbit to enter any room
      return null;
    } else {
      console.log("peer connection succeeded.")
      console.log(`Your Peer ID is [${peerRef.current.id}]`);

      setTextContent((prev) => {
        return [
          ...prev,
          <li>あなたは入室しました</li>,
          <li>あなたのpeerIDは[{peerRef.current.id}]です</li>
        ]
      })
    }
    if (!room) {
      const currentRoom = peerRef.current.joinRoom(
        roomNameRef.current.value, {
        mode: "mesh",
        stream: localStream,
      })
      //add your information composed of keys id and name into the shared information array 
      setUserInformation((prev) => [
        ...prev,
        { id: peerRef.current.id, name: peerRef.current.id },
      ])

      currentRoom.on("peerJoin", (peerId) => {
        setTextContent((prev) => {
          return [
            ...prev,
            <li>peerID[{peerId}]さんが入室しました</li>
          ]
        })
        setUserInformation((prev) =>
          [...prev, { id: peerId, name: peerId, }]
        )
        //share information with people in the same room
        setUserInformation((prev) => {
          currentRoom.send({
            type: 3,
            body: prev,
          })
          return prev;
        })
      })

      currentRoom.on("stream", (stream) => {
        //set others' media streams
        setRemoteAudio((prev) => {
          return [
            ...prev,
            { stream: stream, peerId: stream.peerId },
          ]
        });
      })

      currentRoom.on("data", ({ data, src }) => {
        switch (data.type) {
          //for text chat
          case 1: {
            setTextContent((prev) => {
              return [
                ...prev,
                <li>{getUserName(src)} : {data.body}</li>,
              ]
            })
          } break;
          //to share information of people in the room
          case 2: {
            setUserInformation((prev) => {
              return prev.map((user) => {
                if (user.id === src) {
                  user.name = data.name;
                }
                return user;
              })
            })
          } break;
          //to renew your shared information
          case 3: {
            console.log("----" + data.type + "----")
            setUserInformation(data.body);
          } break;
          //for communication in Morse code
          case 4: {
            console.log("----" + data.type + "----")
            setIsPlaying(data.signal);
            isPlaying ? play() : stop()
          } break;
        }
      });

      currentRoom.on("peerLeave", (peerId) => {
        //renew information
        setUserInformation((prev) => {
          setTextContent((previous) => {
            return [
              ...previous,
              <li>{getUserName(peerId)}さんが退室しました</li>
            ]
          })
          return prev.filter((user) => {
            return user.id !== peerId;
          })
        })

        //delete media stream of a person left the room
        setRemoteAudio(
          remoteAudio.filter((audio) => {
            if (audio.peerId === peerId) {
              audio.stream.getTracks().forEach((track) => track.stop());
            }
            return audio.peerId !== peerId;
          })
        )
      })

      peerRef.current.on("error", (error) => {
        console.log(error);
      })
      setRoom(currentRoom);
    }
  }
  const roomLeaveTrigger = () => {
    if (room) {
      room.close();
      setUserInformation([]);
      setRoom(null);

      //delete all remote media stream
      setRemoteAudio((prev) => {
        return prev.filter((audio) => {
          audio.stream.getTracks().forEach((track) => track.stop());
          return false;
        });
      });

      setTextContent((prev) => {
        return [
          ...prev,
          <li>あなたは退室しました</li>
        ]
      })
      return null;
    }
  };

  //return a name according to input id
  const getUserName = (id) => {
    const getUserObject = () => {
      if (userInformation) {
        return userInformation.filter((user) => {
          return user.id === id
        })
      }
      return;
    }
    if (getUserObject[0]) {
      return getUserObject(id)[0].name;
    } 
    //in case failed to get user name
    return id;
  }

  return (
    <div className="whole">
      <UserInformationContext.Provider value={userInformation}>
        <RoomContext.Provider value={room}>
          <PeerContext.Provider value={peerRef}>
            <div className="left">
              <ManipulateRoom roomEnterTrigger={roomEnterTrigger} roomLeaveTrigger={roomLeaveTrigger} roomNameRef={roomNameRef} />
              <MyCard localAudioRef={localAudioRef} setUserInformation={setUserInformation} />
              <EngageCards roomNameRef={roomNameRef} remoteAudio={remoteAudio} />
            </div>
            <div className="right">
              <TextChat textContent={textContent} setTextContent={setTextContent} getUserName={getUserName} />
              <MorseCode />
              <SubmitMorse play={play} stop={stop} />
            </div>
          </PeerContext.Provider>
        </RoomContext.Provider>
      </UserInformationContext.Provider>
    </div >
  )
}

export default VoiceChat;