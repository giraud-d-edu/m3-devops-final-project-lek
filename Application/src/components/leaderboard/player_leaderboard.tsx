import "./player_leaderboard.css";
import "../../style/global.css";
import { PlayerLeaderboardProps } from "../../models/leaderboard";
import bear from "/images/avatar/bear.png";
import panda from "/images/avatar/panda.png";
import rabbit from "/images/avatar/rabbit.png";

export const PlayerLeaderboard: React.FC<PlayerLeaderboardProps> = ({
  isSelectedPlayer,
  uuid,
  pseudo,
  ranking,
  avatar,
  totalScore,
  numberGameWin,
  numberGameLoose,
  avgAccuracy,
  numberOfSoloGamePlay,
  kps,
}) => {
  return (
    <article
      style={{
        backgroundColor: isSelectedPlayer
          ? " var(--blue)"
          : " var(--background-sign)",
      }}
      key={uuid}
      className="container-player-leader"
    >
      <h2 className="cell-leaderboard cell-leaderboard-stats">{ranking}</h2>
      <div className="flex-row cell-leaderboard cell-leaderboard-user">
        <img
          src={
            avatar === "bear.png"
              ? bear
              : avatar === "rabbit.png"
              ? rabbit
              : panda
          }
        />
        <h2 className="cell-leaderboard-stats">{pseudo}</h2>
      </div>
      <h2 className="cell-leaderboard cell-leaderboard-stats">{totalScore}</h2>
      <h2 className="cell-leaderboard cell-leaderboard-stats">
        {numberGameWin}
      </h2>
      <h2 className="cell-leaderboard cell-leaderboard-stats">
        {numberGameLoose}
      </h2>
      <h2 className="cell-leaderboard cell-leaderboard-stats">
        {numberOfSoloGamePlay}
      </h2>
      <h2 className="cell-leaderboard cell-leaderboard-stats">{avgAccuracy}</h2>
      <h2 className="cell-leaderboard cell-leaderboard-stats">{kps}</h2>
    </article>
  );
};
