import "./historic.css";
import "../leaderboard/leaderboard.css";
import "../../style/global.css";
import { Nav } from "../../components/nav/nav";
import { useEffect, useState } from "react";
import { Store } from "../../services/store";
import { HistoricService } from "../../services/historic_service";
import {
  HistoricProps,
  HistoricGridshotProps,
  HistoricTrackingProps,
} from "../../models/historic";
import { HistoricComp } from "../../components/historic/historic_comp";

const Historic: React.FC = () => {
  const _historicService: HistoricService = new HistoricService();
  const _store: Store = new Store("userData");
  const [datas, setDatas] = useState<HistoricProps>();
  const [jwt, setJwt] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [limit, setLimit] = useState<number>(5);

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

  const getHistoric = async (tracking: boolean) => {
    if (jwt.length > 0) {
      if (tracking) {
        const response = await _historicService.getHistoricTracking(jwt, limit);
        if (response) {
          setDatas(response);
        }
      } else {
        const response = await _historicService.getHistoricGridShot(jwt, limit);
        if (response) {
          setDatas(response);
        }
      }
    }
  };

  useEffect(() => {
    getHistoric(isTracking);
  }, [jwt]);

  const expandLeaderboard = async (newLimit: number, tracking: boolean) => {
    if (jwt.length > 0) {
      if (tracking) {
        const response = await _historicService.getHistoricTracking(
          jwt,
          newLimit
        );

        setLimit(newLimit);
        if (response) {
          setDatas(response);
        }
      } else {
        const response = await _historicService.getHistoricGridShot(
          jwt,
          newLimit
        );
        setLimit(newLimit);
        if (response) {
          setDatas(response);
        }
      }
    }
  };

  // ------------------------------ //
  // -----------Buttons------------ //
  // ------------------------------ //

  const handleNextClick = async () => {
     // Expand historic
    await expandLeaderboard(limit + 5, isTracking);
    setLimit(limit + 5);
  };

  const handleTracking = async (tracking: boolean) => {
    // Switch between tracking and gridshot sort
    setIsTracking(tracking);
    getHistoric(tracking);
  };

  return (
    <>
      <Nav />
      <main className="flex-col container-leaderboard-page">
        <div className="flex-row container-title-buttons">
          <h1>
            Histo<span>ric</span>
          </h1>
          <div className="flex-row container-pagination">
            <div className="flex-row container-sort-btn">
              <button
                style={{
                  backgroundColor:
                    isTracking === false ? "var(--blue)" : "var(--white)",
                }}
                onClick={() => handleTracking(false)}
                className="sort-button"
              >
                Gridshot
              </button>
              <button
                style={{
                  backgroundColor:
                    isTracking === true ? "var(--blue)" : "var(--white)",
                }}
                onClick={() => handleTracking(true)}
                className="sort-button"
              >
                Tracking
              </button>
            </div>
            <div className="flex-row container-sort-btn">
              <button onClick={handleNextClick} className="see-more-button">
                Next
              </button>
            </div>
          </div>
        </div>
        <section className="flex-col container-historic-content">
          <header className="container-historic-header">
            <h2 className="cell-leaderboard">Game date</h2>
            <h2 className="cell-leaderboard">Score</h2>
            <h2 className="cell-leaderboard">Accuracy</h2>
            {isTracking == false && (
              <h2 className="cell-leaderboard">BestStrike</h2>
            )}
            {isTracking == false && <h2 className="cell-leaderboard">Kps</h2>}
          </header>
          <div className="flex-col">
            {datas?.data &&
              Object.values(datas.data).map((game, index) => {
                if ("kps" in game) {
                  const gridshotGame = game as HistoricGridshotProps;
                  return (
                    <HistoricComp
                      key={index}
                      gameDate={gridshotGame.gameDate}
                      score={gridshotGame.score}
                      accuracy={gridshotGame.accuracy}
                      kps={gridshotGame.kps}
                      bestStrike={gridshotGame.bestStrike}
                    />
                  );
                } else {
                  const trackingGame = game as HistoricTrackingProps;
                  return (
                    <HistoricComp
                      key={index}
                      gameDate={trackingGame.gameDate}
                      score={trackingGame.score}
                      accuracy={trackingGame.accuracy}
                    />
                  );
                }
              })}
          </div>
        </section>
      </main>
    </>
  );
};

export default Historic;
