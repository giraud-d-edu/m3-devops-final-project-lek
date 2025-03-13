import "./header_game.css";
import "../../style/global.css";
import { useEffect, useState } from "react";
import { HeaderGameProps } from "../../models/menu";

export const HeaderGame: React.FC<HeaderGameProps> = ({
  score,
  time,
  precision,
}) => {
  const [renderedTime, setRenderedTime] = useState("00:00");
  const [acc, setAcc] = useState("");

  // ---------------------------------- //
  // -----------Format Time------------ //
  // ---------------------------------- //
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    setRenderedTime(formatTime(time));
  }, [time]);

  // -------------------------------------- //
  // -----------Format Accuracy------------ //
  // -------------------------------------- //
  useEffect(() => {
    const formatAccuracy = (nb: number): string => {
      if (Number.isNaN(nb)) {
        return "0";
      } else if (nb > 100) {
        return "100";
      } else {
        return nb.toString();
      }
    };
    setAcc(formatAccuracy(precision));
  }, [precision]);

  return (
    <header className="flex-row container-header-game">
      <div className="flex-row container-score">
        <span style={{ width: score + "px" }} className="score-bar"></span>
        <h2>{score}</h2>
      </div>
      <div className="flex-col">
        <h2 className="timer">{renderedTime}</h2>
        <h2 className="precision">{acc + "%"}</h2>
      </div>
    </header>
  );
};
