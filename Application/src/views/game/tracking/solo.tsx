import React, { useState, useEffect, useRef } from "react";
import "../solo.css";
import "../../../style/global.css";
import { HeaderGame } from "../../../components/headerGame/header_game";
import { Target } from "../../../components/target/target";
import EndMenu from "../../../components/endMenu/end_menu";
import axios from "axios";
import { Store } from "../../../services/store";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const SoloParams: React.FC = () => {
  const [targetPosition, setTargetPosition] = useState<{
    top: number;
    left: number;
  }>({
    top: window.innerHeight / 2 - 200,
    left: window.innerWidth / 2 - 100,
  });
  const gameRef = useRef<HTMLDivElement>(null);
  const _store: Store = new Store("userData");
  const [jwt, setJwt] = useState<string | null>();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalHits, setTotalHits] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [isMouseOverTarget, setIsMouseOverTarget] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // ------------------------- //
  // ---------Rules----------- //
  // ------------------------- //

  const maxScore: number = 10000;
  const maxTime: number = 30; // seconds
  let velocityX = 4; // horizontal speed of target
  let velocityY = 4; // vertical speed of target
  const scorePerHits = 8;

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
      accuracy: Math.ceil(((totalHits / 20) * 100) / seconds),
      score: score,
    };
    if (seconds >= maxTime && jwt && score > 0) {
      try {
        await axios.post(`${API_BASE_URL}/soloPlayTracking`, datas, {
          headers: {
            Authorization: API_KEY + ":" + jwt,
          },
        });
      } catch (error: any) {
        throw new Error(`Couldn't save game datas : ${error.message}`);
      }
    }
  };

  // -------------------------- //
  // ---------Menus------------ //
  // -------------------------- //

  const handleMenuModal = (data: boolean) => {
    setShowMenu(data);
    if (seconds >= maxTime || score >= maxScore) {
      restart(true);
    }
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

  const handleHome = async () => {
    await handleEndGame().then(() => navigate("/home"));
  };

  // ----------------------- //
  // ---------End----------- //
  // ----------------------- //

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

  const restart = async (restart: boolean) => {
    if (restart) {
      await handleEndGame();
      setScore(0);
      setSeconds(0);
      setTotalHits(0);
      setShowMenu(false);
      setHasStarted(false);
      setCountdown(5);
    }
  };

  // ------------------------- //
  // ---------Timer----------- //
  // ------------------------- //

  useEffect(() => {
    // Timer for game
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
    // Timer for countdown
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

  // ------------------------------- //
  // ---------Target Hits----------- //
  // ------------------------------- //

  useEffect(() => {
    // Detect if the user is over the target
    if (hasStarted) {
      const handleMouseEnter = () => {
        setIsMouseOverTarget(true);
      };

      const handleMouseLeave = () => {
        setIsMouseOverTarget(false);
      };

      const targetElement = gameRef.current?.querySelector(".target");
      if (targetElement) {
        targetElement.addEventListener("mouseenter", handleMouseEnter);
        targetElement.addEventListener("mouseleave", handleMouseLeave);
        return () => {
          targetElement.removeEventListener("mouseenter", handleMouseEnter);
          targetElement.removeEventListener("mouseleave", handleMouseLeave);
        };
      }
    }
  }, [hasStarted]);

  useEffect(() => {
    // Calculate the time the user is over the target
    if (!showMenu && hasStarted) {
      let intervalId: NodeJS.Timeout | null = null;

      if (isMouseOverTarget) {
        intervalId = setInterval(() => {
          setScore((prevScore) => prevScore + scorePerHits);
          setTotalHits((prevTotalHits) => prevTotalHits + 1);
        }, 40);
      } else {
        clearInterval(intervalId as unknown as NodeJS.Timeout);
      }

      return () => {
        clearInterval(intervalId as NodeJS.Timeout);
      };
    }
  }, [isMouseOverTarget, showMenu, hasStarted]);

  // -------------------------- //
  // ---------Target----------- //
  // -------------------------- //

  const moveTarget = () => {
    // Set initial target position at the center of the window
    let targetPosition = {
      top: window.innerHeight / 2 - 200,
      left: window.innerWidth / 2 - 100,
    };
    const targetWidth = 200;
    const targetHeight = 300;
    // Stop the target if the game is finished
    if (seconds == 0 || seconds >= maxTime) {
      targetPosition = {
        top: window.innerHeight / 2 - targetHeight,
        left: window.innerWidth / 2 - targetWidth,
      };
    }
    const moveTarget = () => {
      // move randomly horizontally the target
      if (Math.random() < 0.01) {
        velocityX *= -1;
      }
      // move randomly vertically the target
      if (Math.random() < 0.01) {
        velocityY *= -1;
      }
      targetPosition.left += velocityX;
      targetPosition.top += velocityY;

      // Check if target hits horizontal borders
      if (targetPosition.left <= 0) {
        targetPosition.left = 0;
        velocityX = Math.abs(velocityX);
      } else if (targetPosition.left >= window.innerWidth - targetWidth) {
        targetPosition.left = window.innerWidth - targetWidth;
        velocityX = -Math.abs(velocityX);
      }
      // Check if target hits vertical borders
      if (targetPosition.top <= 0) {
        targetPosition.top = 0;
        velocityY = Math.abs(velocityY);
      } else if (targetPosition.top >= window.innerHeight - targetHeight) {
        targetPosition.top = window.innerHeight - targetHeight;
        velocityY = -Math.abs(velocityY);
      }
      // update target position
      setTargetPosition({ ...targetPosition });
      animationId = requestAnimationFrame(moveTarget);
    };
    let animationId = requestAnimationFrame(moveTarget);

    return () => {
      cancelAnimationFrame(animationId);
    };
  };

  useEffect(() => {
    // move the target while the game is On
    if (hasStarted) {
      moveTarget();
    }
  }, [hasStarted]);

  return (
    <main className="container-game flex-col" role="main">
      <HeaderGame
        score={score}
        time={seconds}
        precision={Math.ceil(((totalHits / 20) * 100) / seconds)}
      />
      {countdown > 0 && <h1 className="countdown">{countdown}</h1>}
      {hasStarted && (
        <div ref={gameRef} className="game-params flex-row">
          <Target
            target={{
              id: 1,
              top: targetPosition.top,
              left: targetPosition.left,
            }}
          />
        </div>
      )}
      {showMenu && (
        <EndMenu
          bestStrike={0}
          score={score}
          accuracy={Math.ceil(((totalHits / 20) * 100) / seconds)}
          targetHits={totalHits}
          totalClics={0}
          close={handleMenuModal}
          restart={restart}
          end={handleHome}
        />
      )}
    </main>
  );
};

export default SoloParams;
