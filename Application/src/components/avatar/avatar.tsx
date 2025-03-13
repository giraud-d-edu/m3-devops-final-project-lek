import "./avatar.css";
import "../../style/global.css";
import { useState } from "react";
import bear from "/images/avatar/bear.png";
import panda from "/images/avatar/panda.png";
import rabbit from "/images/avatar/rabbit.png";
import { AvatarModalProps } from "../../models/profile";

export const AvatarModal: React.FC<AvatarModalProps> = ({
  callback,
  currentAvatar,
}) => {
  const avatarList: Array<string> = ["bear.png", "panda.png", "rabbit.png"];
  const [avatarSelected, setAvatarSelected] = useState(currentAvatar);
  return (
    <div className="container-avatar-modal-shadow flex-col">
      <section className="flex-col container-avatar-modal">
        <div className="flex-row header-modal">
          <h2>Edit avatar</h2>
          <button onClick={() => callback(avatarSelected)}>Select</button>
        </div>
        <div className="flex-row container-avatars">
          {avatarList.map((avatar, index) => (
            <article
              onClick={() => {
                setAvatarSelected(avatar);
              }}
              style={{
                borderColor:
                  avatarSelected === avatar ? "var(--blue)" : "transparent",
              }}
              className="flex-col container-avatar"
              key={index}
            >
              <img
                src={
                  avatar === "bear.png"
                    ? bear
                    : avatar === "rabbit.png"
                    ? rabbit
                    : panda
                }
                alt={avatar}
              />
              <p>{avatar.slice(0, -4)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
