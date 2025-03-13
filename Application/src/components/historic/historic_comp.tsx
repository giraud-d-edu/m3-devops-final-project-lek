import "./historic_comp.css";
import "../leaderboard/player_leaderboard.css";
import "../../style/global.css";
import { HistoricCompProps } from "../../models/historic";

export const HistoricComp: React.FC<HistoricCompProps> = ({
  score,
  accuracy,
  gameDate,
  kps,
  bestStrike,
}) => {
  // ---------------------------------- //
  // -----------Format Date------------ //
  // ---------------------------------- //
  function formatDate(isoDateString: Date) {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  return (
    <article className="container-player-historic">
      <h2 className="cell-leaderboard cell-leaderboard-stats">
        {formatDate(gameDate)}
      </h2>
      <h2 className="cell-leaderboard cell-leaderboard-stats">{score}</h2>
      <h2 className="cell-leaderboard cell-leaderboard-stats">{accuracy}</h2>
      {bestStrike && (
        <h2 className="cell-leaderboard cell-leaderboard-stats">
          {bestStrike}
        </h2>
      )}
      {kps && (
        <h2 className="cell-leaderboard cell-leaderboard-stats">{kps}</h2>
      )}
    </article>
  );
};
