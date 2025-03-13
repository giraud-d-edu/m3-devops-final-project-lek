import "./end_menu.css";
import "../../style/global.css";
import { useEffect, useState } from "react";

interface EndMenuProps {
  score: number;
  accuracy: number;
  bestStrike: number;
  targetHits: number;
  totalClics: number;
  close: Function;
  restart: Function;
  end: Function;
}

const EndMenu: React.FC<EndMenuProps> = ({
  score,
  accuracy,
  bestStrike,
  targetHits,
  totalClics,
  close,
  restart,
  end,
}) => {
  // -------------------------------------- //
  // -----------Format Accuracy------------ //
  // -------------------------------------- //
  const [acc, setAcc] = useState("");
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
    setAcc(formatAccuracy(accuracy));
  }, [accuracy]);

  return (
    <div className="flex-col container-end-menu-shadow">
      <div className="flex-col container-end-menu">
        <section className="flex-row container-score-stat ">
          <h2>Score</h2>
          <p>{score}</p>
        </section>
        <section className="flex-row container-stats-buttons">
          <div className="flex-col container-stats">
            <div className="flex-col container-target-stats">
              <div className="flex-row container-stat">
                <h2>Targets hit</h2>
                <p>{targetHits + "x"}</p>
              </div>

              <div className="flex-row container-stat">
                <h2>Total clics</h2>
                <p>{totalClics + "x"}</p>
              </div>
            </div>
            <div className="flex-row container-col-stats">
              <div className="flex-col container-col-stat">
                <h2>Best strike</h2>
                <p>{bestStrike + "x"}</p>
              </div>
              <div className="flex-col container-col-stat">
                <h2>Accuracy</h2>
                <p>{acc + "%"}</p>
              </div>
            </div>
          </div>
          <div className="flex-col container-buttons">
            <button
              className="buttons-menu-stats"
              onClick={() => {
                restart(true);
              }}
            >
              Restart
            </button>
            <button
              className="buttons-menu-stats"
              onClick={() => {
                end(true);
              }}
            >
              Home
            </button>
            <button className="buttons-menu-stats" onClick={() => close(false)}>
              Close
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EndMenu;
