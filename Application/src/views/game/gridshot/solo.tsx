import React, { useState, useEffect, useRef } from "react";
import "../solo.css";
import "../../../style/global.css";
import { HeaderGame } from "../../../components/headerGame/header_game";
import { Target } from "../../../components/target/target";
import EndMenu from "../../../components/endMenu/end_menu";
import { TargetProps } from "../../../models/game";
import axios from "axios";
import { Store } from "../../../services/store";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const Solo: React.FC = () => {
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState<TargetProps[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);
  const [seconds, setSeconds] = useState(0);
  const [totalTargets, setTotalTargets] = useState(0);
  const [totalClics, setTotalClics] = useState(0);
  const [currentStrike, setCurrentStrike] = useState(0);
  const [bestStrike, setBestStrike] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [hasStarted, setHasStarted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [jwt, setJwt] = useState<string | null>();
  const _store: Store = new Store("userData");
  const navigate = useNavigate();

  // ------------------------- //
  // ---------Rules----------- //
  // ------------------------- //

  const maxScore: number = 10000;
  const maxTime: number = 30; // seconds

  // ------------------------- //
  // ----------Jwt------------ //
  // ------------------------- //

  useEffect(() => {
    const jwt_store = _store.load();
    if (jwt_store) {
      setJwt(jwt_store);
    }
  }, [jwt]);

  // ---------------------------------- //
  // ---------------Submit------------- //
  // ---------------------------------- //

  const handleEndGame = async () => {
    const datas = {
      timePlayedInSecond: seconds,
      numberOfTargetDown: totalTargets,
      accuracy: Math.ceil((totalTargets * 100) / totalClics),
      bestStrike: bestStrike,
      score: score,
    };
    if (seconds >= maxTime && jwt && score > 0) {
      try {
        await axios.post(`${API_BASE_URL}/soloPlayGrid`, datas, {
          headers: {
            Authorization: API_KEY + ":" + jwt,
          },
        });
      } catch (error: any) {
        throw new Error(`Couldn't save game datas : ${error.message}`);
      }
    }
  };

  // ------------------------- //
  // ---------Menu------------ //
  // ------------------------- //

  const handleMenuModal = (data: boolean) => {
    setShowMenu(data);
    if (seconds >= maxTime || score >= maxScore) {
      restart(true);
    }
    setTotalClics(totalClics - 1);
  };

  const handleEchap = (event: { key: string }) => {
    if (event.key === "Escape") {
      if (seconds >= maxTime || score >= maxScore) {
        setShowMenu(true);
      } else {
        setShowMenu((prevShowMenu) => !prevShowMenu);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEchap);
    return () => {
      document.removeEventListener("keydown", handleEchap);
    };
  }, []);

  const restart = async (restart: boolean) => {
    if (restart) {
      await handleEndGame();
      setScore(0);
      setBestStrike(0);
      setCurrentStrike(0);
      setSeconds(0);
      setTotalClics(-1);
      setTotalTargets(0);
      setShowMenu(false);
      const initialTargets: TargetProps[] = generateRandomTargets(4);
      setTargets(initialTargets);
      setHasStarted(false);
      setCountdown(5);
    }
  };

  const handleHome = async () => {
    await handleEndGame().then(() => navigate("/home"));
  };

  // ------------------------- //
  // ---------Score----------- //
  // ------------------------- //

  useEffect(() => {
    const checkEnd = () => {
      if (score >= maxScore) {
        setShowMenu(true);
      }
      if (seconds >= maxTime) {
        setShowMenu(true);
      }
    };
    if (score < 0) {
      setScore(0);
    }
    checkEnd();
  }, [score, seconds]);

  // ------------------------------- //
  // ---------Best Strike----------- //
  // ------------------------------- //

  useEffect(() => {
    if (currentStrike > bestStrike) {
      setBestStrike(currentStrike);
    }
  }, [currentStrike]);

  // ------------------------- //
  // ---------Timer----------- //
  // ------------------------- //

  useEffect(() => {
    // Timer Game
    let intervalId: NodeJS.Timeout | null = null;
    if (!showMenu && countdown <= 0) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showMenu, countdown]);

  useEffect(() => {
    // Timer start game
    let intervalId: NodeJS.Timeout | null = null;
    if (!showMenu && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setHasStarted(true);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showMenu, countdown]);

  // ------------------------------ //
  // ---------Init Targets--------- //
  // ------------------------------ //

  useEffect(() => {
    const initialTargets: TargetProps[] = generateRandomTargets(4);
    setTargets(initialTargets);
    setBestStrike(0);
    setCurrentStrike(0);
  }, []);

  useEffect(() => {
    // regenerate targets when window size changes
    const handleResize = () => {
      const newTargets = generateRandomTargets(4);
      setTargets(newTargets);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ---------------------------------- //
  // ---------Generate targets--------- //
  // ---------------------------------- //

  useEffect(() => {
    // randomly generate new targets
    if (targets.length < 3) {
      // Generate new targets if the current number of targets is less than 3
      const newTargets = generateRandomTargets(3 - targets.length);
      setTargets((prevTargets) => [...prevTargets, ...newTargets]);
    } else if (targets.length > 5) {
      // Truncate the targets array if the number of targets exceeds 5
      setTargets((prevTargets) => prevTargets.slice(0, 5));
    }
  }, [targets]);

  const generateRandomTargets = (count: number): TargetProps[] => {
    const gridRowCount = 3;
    const gridColumnCount = 3;
    const cellWidth = 325 / gridColumnCount;
    const cellHeight = 325 / gridRowCount;

    const newTargets: TargetProps[] = [];
    const existingPositions: { [key: string]: boolean } = {};

    // Function to generate a unique position for a target
    const generateUniquePosition = (): string => {
      let newPosition: string;
      do {
        const gridX = Math.floor(Math.random() * gridColumnCount);
        const gridY = Math.floor(Math.random() * gridRowCount);
        newPosition = `${gridX},${gridY}`;
      } while (existingPositions[newPosition]);

      return newPosition;
    };

    // Array of positions occupied by existing targets
    const targetPositions = targets.map(
      (target) =>
        `${Math.floor(target.left / cellWidth)},${Math.floor(
          target.top / cellHeight
        )}`
    );

    // Generate new targets
    for (let i = 0; i < count; i++) {
      let newTarget: TargetProps;
      let newPosition: string;
      do {
        // Generate a unique position for the new target
        newPosition = generateUniquePosition();
      } while (
        existingPositions[newPosition] ||
        targetPositions.includes(newPosition)
      );

      // Mark the new position as occupied
      existingPositions[newPosition] = true;
      // Convert position to grid coordinates
      const [gridX, gridY] = newPosition.split(",").map(Number);
      // Calculate the top-left coordinates for the new target
      newTarget = {
        id: Math.floor(Math.random() * 1000),
        top: gridY * cellHeight,
        left: gridX * cellWidth,
      };

      newTargets.push(newTarget);
    }
    return newTargets;
  };

  // ---------------------------------- //
  // ---------Remove targets----------- //
  // ---------------------------------- //

  useEffect(() => {
    // to delete a target when clicked
    if (hasStarted) {
      const handleClick = (event: MouseEvent) => {
        const clickedTargetId = parseInt((event.target as HTMLDivElement).id);
        if (!isNaN(clickedTargetId)) {
          setScore(score + 10 + Math.ceil(currentStrike / 10));
          setTargets((prevTargets) =>
            prevTargets.filter((target) => target.id !== clickedTargetId)
          );
        }
      };
      document.addEventListener("click", handleClick);
      return () => {
        document.removeEventListener("click", handleClick);
      };
    }
  }, [score, targets, hasStarted]);

  useEffect(() => {
    //to count global clicks
    const handleGlobalClick = () => {
      if (!showMenu && hasStarted) {
        setTotalClics(totalClics + 1);
      }
    };
    document.body.addEventListener("click", handleGlobalClick);
    return () => {
      document.body.removeEventListener("click", handleGlobalClick);
    };
  }, [totalClics, showMenu, hasStarted]);

  return (
    <main className="container-game flex-col" role="main">
      <HeaderGame
        score={score}
        time={seconds}
        precision={
          totalClics > 0 && totalTargets > 0
            ? Math.min(Math.ceil((totalTargets * 100) / totalClics), 100)
            : 0
        }
      />
      {countdown > 0 && <h1 className="countdown">{countdown}</h1>}
      {hasStarted && (
        <div
          ref={gameRef}
          className="game flex-row"
          onClick={(event) => {
            if (event.target === gameRef.current) {
              setScore(score - 10);
              setCurrentStrike(0);
            } else {
              setTotalTargets(totalTargets + 1);
              setCurrentStrike(currentStrike + 1);
            }
          }}
        >
          {targets.map((target, index) => (
            <Target key={index} target={target} />
          ))}
        </div>
      )}
      <h2 className="bestStrike">{currentStrike + "x"}</h2>
      {showMenu && (
        <EndMenu
          score={score}
          accuracy={
            totalClics > 0 && totalTargets > 0
              ? Math.min(Math.ceil((totalTargets * 100) / totalClics), 100)
              : 0
          }
          bestStrike={bestStrike}
          targetHits={totalTargets}
          totalClics={totalClics < 0 ? 0 : totalClics}
          close={handleMenuModal}
          restart={restart}
          end={handleHome}
        />
      )}
    </main>
  );
};

export default Solo;
