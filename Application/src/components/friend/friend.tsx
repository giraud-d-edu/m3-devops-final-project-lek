import "./friend.css";
import "../../style/global.css";
import { FriendProps } from "../../models/friend";
import bear from "/images/avatar/bear.png";
import panda from "/images/avatar/panda.png";
import rabbit from "/images/avatar/rabbit.png";
import close_icon from "/images/icons/close.png";
import validate_icon from "/images/icons/check.png";

export const Friend: React.FC<FriendProps> = ({
  avatar,
  pseudo,
  requestId,
  isRequest,
  acceptRequest,
}) => {
  return (
    <article className="flex-row container-friend">
      <div className="flex-row container-infos">
        <img
          className="profile-picture"
          src={
            avatar === "bear.png"
              ? bear
              : avatar === "rabbit.png"
              ? rabbit
              : panda
          }
        />
        <p>{pseudo}</p>
      </div>
      {isRequest && (
        <div className="flex-col container-options">
          <img
            src={validate_icon}
            alt="accept-request"
            onClick={() => acceptRequest(true, requestId)}
          />
          <img
            src={close_icon}
            alt="refuse-request"
            onClick={() => acceptRequest(false, requestId)}
          />
        </div>
      )}
    </article>
  );
};
