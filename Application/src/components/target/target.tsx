import "./target.css";
import "../../style/global.css";
import { TargetCompProps } from "../../models/game";

export const Target: React.FC<TargetCompProps> = ({ target }) => {
  return (
    <div
      id={target.id.toString()}
      className="target flex-col"
      style={{ top: target.top, left: target.left }}
    >
      <span></span>
    </div>
  );
};
