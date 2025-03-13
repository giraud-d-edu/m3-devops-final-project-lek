import "./leaderboard.css";
import "../../style/global.css";
import { Nav } from "../../components/nav/nav";
import { useEffect, useState } from "react";
import { LeaderboardLimits, LeaderboardProps } from "../../models/leaderboard";
import { PlayerLeaderboard } from "../../components/leaderboard/player_leaderboard";
import { LeaderboardService } from "../../services/leaderboard_service";
import { Store } from "../../services/store";
import sort_icon from "/images/icons/sort_icon.png";

const Leaderboard: React.FC = () => {
  const _leaderboardService: LeaderboardService = new LeaderboardService();
  const _store: Store = new Store("userData");
  const [datas, setDatas] = useState<LeaderboardProps>();
  const [jwt, setJwt] = useState("");
  const [endpoint, setEndpoint] = useState("score");
  const [isFriend, setIsFriend] = useState(false);
  const [limits, setLimits] = useState<LeaderboardLimits>({
    limitMax: 5,
    limitMin: 5,
  });

  // -------------------------- //
  // -----------JWT------------ //
  // -------------------------- //

  useEffect(() => {
    const jwt_store = _store.load();
    if (jwt_store) {
      setJwt(jwt_store);
    }
  }, [jwt]);

  // --------------------------------- //
  // -----------Load datas------------ //
  // --------------------------------- //

  const getLeaderboard = async (friend: boolean) => {
    if (jwt.length > 0) {
      if (friend) {
        const response = await _leaderboardService.getFriendLimitsLeaderboard(
          endpoint,
          jwt
        );
        if (response) {
          setDatas(response);
          setLimits({
            limitMin: response.limitMin,
            limitMax: response.limitMax,
          });
        }
      } else {
        const response = await _leaderboardService.getLimitsLeaderboard(
          endpoint,
          jwt
        );
        if (response) {
          setDatas(response);
          setLimits({
            limitMin: response.limitMin,
            limitMax: response.limitMax,
          });
        }
      }
    }
  };

  useEffect(() => {
    getLeaderboard(isFriend);
  }, [endpoint, jwt]);

  const expandLeaderboard = async (
    // Pagination of leaderboard
    limitMin: number,
    limitMax: number,
    friend: boolean
  ) => {
    if (jwt.length > 0) {
      if (friend) {
        const response =
          await _leaderboardService.getFriendLeaderboardWithLimits(
            endpoint,
            jwt,
            limitMin,
            limitMax
          );
        if (response) {
          setDatas(response);
        }
      } else {
        const response = await _leaderboardService.getLeaderboardWithLimits(
          endpoint,
          jwt,
          limitMin,
          limitMax
        );
        if (response) {
          setDatas(response);
        }
      }
    }
  };

  // ------------------------------ //
  // -----------Buttons------------ //
  // ------------------------------ //

  const handlePreviousClick = async () => {
    // Load before myself
    setLimits((prevLimits) => ({
      limitMax: prevLimits.limitMax,
      limitMin: prevLimits.limitMin + 5,
    }));
    await expandLeaderboard(limits.limitMin + 5, limits.limitMax, isFriend);
    setDatas((prevDatas) => {
      if (prevDatas) {
        return {
          ...prevDatas,
          limitMin: prevDatas.limitMin + 5,
        };
      }
      return undefined;
    });
  };

  const handleNextClick = async () => {
    // Load after myself
    setLimits((prevLimits) => ({
      limitMax: prevLimits.limitMax + 5,
      limitMin: prevLimits.limitMin,
    }));
    await expandLeaderboard(limits.limitMin, limits.limitMax + 5, isFriend);
    setDatas((prevDatas) => {
      if (prevDatas) {
        return {
          ...prevDatas,
          limitMax: prevDatas.limitMax + 5,
        };
      }
      return undefined;
    });
  };

  const handleFriend = async (friend: boolean) => {
    // Switch between all / friends
    setIsFriend(friend);
    getLeaderboard(friend);
  };

  return (
    <>
      <Nav />
      <main className="flex-col container-leaderboard-page">
        <div className="flex-row container-title-buttons">
          <h1>
            Leader<span>board</span>
          </h1>
          <div className="flex-row container-pagination">
            <div className="flex-row container-sort-btn">
              <button
                style={{
                  backgroundColor:
                    isFriend === false ? "var(--blue)" : "var(--white)",
                }}
                onClick={() => handleFriend(false)}
                className="sort-button"
              >
                all
              </button>
              <button
                style={{
                  backgroundColor:
                    isFriend === true ? "var(--blue)" : "var(--white)",
                }}
                onClick={() => handleFriend(true)}
                className="sort-button"
              >
                Friends
              </button>
            </div>
            <div className="flex-row container-sort-btn">
              <button onClick={handlePreviousClick} className="see-more-button">
                Previous
              </button>
              <button onClick={handleNextClick} className="see-more-button">
                Next
              </button>
            </div>
          </div>
        </div>
        <section className="flex-col container-leaderboard-content">
          <header className="container-leaderboard-header">
            <h2 className="cell-leaderboard">Rank</h2>
            <h2 className="cell-leaderboard">Username</h2>
            <div
              className="flex-row container-sort"
              onClick={() => setEndpoint("score")}
            >
              <h2 className="cell-leaderboard">Total Score</h2>
              <img
                style={{ display: endpoint === "score" ? "block" : "none" }}
                src={sort_icon}
                alt="sort-icon"
              />
            </div>
            <div
              className="flex-row container-sort"
              onClick={() => setEndpoint("win")}
            >
              <h2 className="cell-leaderboard">Wins</h2>
              <img
                style={{ display: endpoint === "win" ? "block" : "none" }}
                src={sort_icon}
                alt="sort-icon"
              />
            </div>
            <div
              className="flex-row container-sort"
              onClick={() => setEndpoint("loose")}
            >
              <h2 className="cell-leaderboard">Looses</h2>
              <img
                style={{ display: endpoint === "loose" ? "block" : "none" }}
                src={sort_icon}
                alt="sort-icon"
              />
            </div>
            <div
              className="flex-row container-sort"
              onClick={() => setEndpoint("solo")}
            >
              <h2 className="cell-leaderboard">Solo games</h2>
              <img
                style={{ display: endpoint === "solo" ? "block" : "none" }}
                src={sort_icon}
                alt="sort-icon"
              />
            </div>
            <div
              className="flex-row container-sort"
              onClick={() => setEndpoint("acc")}
            >
              <h2 className="cell-leaderboard">Average Accuracy</h2>
              <img
                style={{ display: endpoint === "acc" ? "block" : "none" }}
                src={sort_icon}
                alt="sort-icon"
              />
            </div>
            <div
              className="flex-row container-sort"
              onClick={() => setEndpoint("kps")}
            >
              <h2 className="cell-leaderboard">KpS</h2>
              <img
                style={{ display: endpoint === "kps" ? "block" : "none" }}
                src={sort_icon}
                alt="sort-icon"
              />
            </div>
          </header>
          <div className="flex-col">
            {datas?.top5 &&
              Object.values(datas.top5).map((player, index) => (
                <PlayerLeaderboard
                  key={index}
                  isSelectedPlayer={player.isSelectedPlayer}
                  avgAccuracy={player.avgAccuracy}
                  uuid={player.uuid}
                  pseudo={player.pseudo}
                  avatar={player.avatar}
                  ranking={player.ranking}
                  totalScore={player.totalScore}
                  numberGameLoose={player.numberGameLoose}
                  numberGameWin={player.numberGameWin}
                  numberOfSoloGamePlay={player.numberOfSoloGamePlay}
                  kps={player.kps}
                />
              ))}
          </div>
          <div className="flex-col">
            {isFriend == false && (
              <article className="container-player-leader separation-leaderboard">
                <h2 className="cell-leaderboard cell-leaderboard-stats">...</h2>
                <div className="flex-row cell-leaderboard cell-leaderboard-user">
                  <h2 className="cell-leaderboard-stats"> ...</h2>
                </div>
                <h2 className="cell-leaderboard cell-leaderboard-stats">...</h2>
                <h2 className="cell-leaderboard cell-leaderboard-stats">...</h2>
                <h2 className="cell-leaderboard cell-leaderboard-stats">...</h2>
                <h2 className="cell-leaderboard cell-leaderboard-stats">...</h2>
                <h2 className="cell-leaderboard cell-leaderboard-stats">...</h2>
                <h2 className="cell-leaderboard cell-leaderboard-stats">...</h2>
              </article>
            )}
            {datas?.data &&
              Object.values(datas.data).map((player, index) => (
                <PlayerLeaderboard
                  key={index}
                  isSelectedPlayer={player.isSelectedPlayer}
                  avgAccuracy={player.avgAccuracy}
                  uuid={player.uuid}
                  pseudo={player.pseudo}
                  avatar={player.avatar}
                  ranking={player.ranking}
                  totalScore={player.totalScore}
                  numberGameLoose={player.numberGameLoose}
                  numberGameWin={player.numberGameWin}
                  numberOfSoloGamePlay={player.numberOfSoloGamePlay}
                  kps={player.kps}
                />
              ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Leaderboard;
