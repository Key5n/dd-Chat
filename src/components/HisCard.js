import { useState, useContext} from 'react';
import { UserInformationContext } from './VoiceChat';
import icon from './image/icon.svg';
import mic from './image/マイクアイコン.svg';
import micoff from './image/マイク消音アイコン.svg'
import headphone from './image/ヘッドフォンアイコン.svg';
import officon from './image/ヘッドフォンオフアイコン.png';

/* 
  I, the author of this application, haven't added mute function
*/

function HisCard({user}) {
  const [isMute, setIsMuted] = useState(false);

  return (
    <div className="his-card">
      <img src={icon} alt="icon" width="15%" />
      <p className="his-name">{user.name}</p>
      {isMute ? (
        <img src={micoff} alt="mic-icon" width="5%" style={{ marginRight: "2%" }} />
      ) : (
        <img src={mic} alt="mic-icon" width="5%" style={{ marginRight: "2%" }} />
      )}
    </div>
  )
}

export default HisCard;