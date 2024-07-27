import { useEffect, useRef, useState } from "react";
import { useSnake } from "../../context/SnakeContext";
import {
  drawCanvasBg,
  drawSnakeFoodOnCanvas,
  drawSnakeOnCanvas,
  SNAKE_FOOD_COLORS,
} from "../../utils/canvas";
import GameOverPopup from "./GameOverPopup";
import GameBtnControls from "../reusable/GameBtnControls";
import GameBoardHeader from "./GameBoardHeader";
import { Howl } from "howler";
import goSound from "../../assets/gameover.wav";
import gsSound from "../../assets/gamestart.mp3";
import foodSound from "../../assets/food.mp3";

export type SnakeDirectionType = "left" | "right" | "up" | "down";
let snakeDirection: SnakeDirectionType = "right";

const GamePlayBoard = () => {
  // context
  let {
    gameStatus,
    setGameStatus,
    userScore,
    setUserScore,
    userHighScore,
    setUserHighScore,
  } = useSnake();

  //   states
  const CanvasRef = useRef<HTMLCanvasElement>(null);
  const GameScreenRef = useRef<HTMLDivElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [CanvasWidth, setCanvasWidth] = useState(300);
  const [isSnakeRunning, setIsSnakeRunning] = useState(false);
  const snakeRef = useRef(isSnakeRunning);

  // variables
  let cellSize = CanvasWidth / 16;

  let snake = [
    { x: cellSize * 5, y: cellSize * 4 },
    { x: cellSize * 4, y: cellSize * 4 },
    { x: cellSize * 3, y: cellSize * 4 },
  ];
  let snakeFood = { x: cellSize * 7, y: cellSize * 7 };
  let snakeColor = 0;
  let frame = 0;

  // audio controller
  const adController = {
    food: new Howl({ src: [foodSound.toString()] }),
    gameOver: new Howl({ src: [goSound.toString()] }),
    gameStart: new Howl({ src: [gsSound.toString()] }),
  };
  //   to animate canvas on every frame
  const animateCanvas = () => {
    if (!context || !isSnakeRunning || !snakeRef.current) return;

    context.clearRect(0, 0, CanvasWidth, CanvasWidth);
    drawCanvasBg({ CanvasWidth, cellSize, context });
    drawSnakeOnCanvas({ snake, cellSize, context });
    drawSnakeFoodOnCanvas({
      x: snakeFood.x,
      y: snakeFood.y,
      context,
      cellSize,
      snakeColor,
    });

    if (frame % 8 === 0) {
      const newHeadPosition = calculateNewHeadPosition();

      snake.unshift(newHeadPosition);
      snake.pop();

      calculateSnakeCollition();
      calculateSnakeFoodCollision();
    }

    frame++;
    // console.log("animating canvas", gameStatus);
    requestAnimationFrame(animateCanvas);
  };

  //   to calculate snake food collision
  const calculateSnakeFoodCollision = () => {
    if (!context) return;

    // chekc if the snakeHead and food positions are same
    if (snakeFood.x === snake[0].x && snakeFood.y === snake[0].y) {
      snakeFood = {
        x: Math.floor(Math.random() * (CanvasWidth / cellSize)) * cellSize,
        y: Math.floor(Math.random() * (CanvasWidth / cellSize)) * cellSize,
      };
      if (snakeColor >= SNAKE_FOOD_COLORS.length - 1) {
        snakeColor = 0;
      } else {
        snakeColor += 1;
      }

      drawSnakeFoodOnCanvas({
        x: snakeFood.x,
        y: snakeFood.y,
        context,
        cellSize,
        snakeColor,
      });
      addSnakeTail();
      userScore += 5;
      setUserScore(userScore);
      adController.food.play();
    }
  };

  // to calcultate snake collistions
  const calculateSnakeCollition = () => {
    const snakeHead = { ...snake[0] };

    // if snake touches to the boundary of canvas
    if (
      snakeHead.x < 0 ||
      snakeHead.x >= CanvasWidth ||
      snakeHead.y < 0 ||
      snakeHead.y >= CanvasWidth
    ) {
      gameOver();

      return;
    }

    // if snake touches one of it tails
    snake.slice(1).forEach((tail) => {
      if (snakeHead.x === tail.x && snakeHead.y === tail.y) {
        gameOver();
      }
    });
  };

  //   game over
  const gameOver = () => {
    console.log("game over");
    gameStatus = "game-over";
    setGameStatus(gameStatus);
    setIsSnakeRunning(false);
    snakeRef.current = false;

    if (userScore >= userHighScore) {
      localStorage.setItem("snakeGameHighScore", String(userScore));
      setUserHighScore(userScore);
    }
    adController.gameOver.play();
  };

  //   to add new snake tail
  const addSnakeTail = () => {
    const tail = { ...snake[snake.length - 1] };
    snake.push(tail);
  };

  const calculateNewHeadPosition = () => {
    const snakeHead = { ...snake[0] };

    switch (snakeDirection) {
      case "left":
        snakeHead.x -= cellSize;
        break;
      case "right":
        snakeHead.x += cellSize;
        break;
      case "up":
        snakeHead.y -= cellSize;
        break;
      case "down":
        snakeHead.y += cellSize;
        break;
      default:
        break;
    }

    return snakeHead;
  };

  // Set up canvas dimensions
  useEffect(() => {
    const calculateCanvasDimensions = () => {
      if (!GameScreenRef.current || !CanvasRef.current) return;

      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      const scoresPanel = GameScreenRef.current.children[0];
      const btnControls = GameScreenRef.current.children[2];

      let availableHeight =
        windowHeight - (scoresPanel.clientHeight + btnControls.clientHeight);

      if (windowWidth > availableHeight) {
        CanvasRef.current.width = availableHeight - (availableHeight % 10) - 20;
        CanvasRef.current.height =
          availableHeight - (availableHeight % 10) - 20;
      } else {
        CanvasRef.current.width = windowWidth - (windowWidth % 10) - 20;
        CanvasRef.current.height = windowWidth - (windowWidth % 10) - 20;
      }
      setCanvasWidth(CanvasRef.current.width);
    };
    calculateCanvasDimensions();

    window.addEventListener("resize", calculateCanvasDimensions);
  }, []);

  // Initialize canvas context and draw canvas elements
  useEffect(() => {
    if (!context) {
      const ctx = CanvasRef.current?.getContext("2d");
      ctx && setContext(ctx);
    }
    if (context) {
      drawCanvasBg({ CanvasWidth, context, cellSize });
      drawSnakeOnCanvas({ snake, context, cellSize });
    }
  }, [context]);

  // Start animation when snake is running
  useEffect(() => {
    if (isSnakeRunning) {
      snakeRef.current = true;
      animateCanvas();
    }
    // Add keydown event listener for handling user inputs
    window.addEventListener("keydown", handleUserKeyInput);
    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleUserKeyInput);
    };
  }, [isSnakeRunning]);

  // Handle user inputs
  const handleUserKeyInput = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
        if (gameStatus === "in-progress") {
          if (!isSnakeRunning) setIsSnakeRunning(true);
          // Prevent changing direction if currently moving downwards
          if (snakeDirection !== "down") snakeDirection = "up";
        }
        break;
      case "ArrowDown":
        if (gameStatus === "in-progress") {
          if (!isSnakeRunning) setIsSnakeRunning(true);
          // Prevent changing direction if currently moving upwards
          if (snakeDirection !== "up") snakeDirection = "down";
        }
        break;
      case "ArrowLeft":
        if (gameStatus === "in-progress") {
          if (!isSnakeRunning) setIsSnakeRunning(true);
          // Prevent changing direction if currently moving rightwards
          if (snakeDirection !== "right") snakeDirection = "left";
        }
        break;
      case "ArrowRight":
        if (gameStatus === "in-progress") {
          if (!isSnakeRunning) setIsSnakeRunning(true);
          // Prevent changing direction if currently moving leftwards
          if (snakeDirection !== "left") snakeDirection = "right";
        }
        break;
      default:
        break;
    }
  };

  // play again btn handler
  const playAgainHandler = () => {
    setGameStatus("in-progress");
    setUserScore(0);
    setIsSnakeRunning(true);
    snakeDirection = "right";
    adController.gameStart.play();
  };

  // handler for controlbtn
  const handleControlsBtnClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    switch (event.currentTarget.ariaLabel) {
      case "up":
        if (gameStatus === "in-progress") {
          if (!isSnakeRunning) setIsSnakeRunning(true);
          // Prevent changing direction if currently moving downwards
          if (snakeDirection !== "down") snakeDirection = "up";
        }
        break;
      case "down":
        if (gameStatus === "in-progress") {
          if (!isSnakeRunning) setIsSnakeRunning(true);
          // Prevent changing direction if currently moving upwards
          if (snakeDirection !== "up") snakeDirection = "down";
        }
        break;
      case "left":
        if (gameStatus === "in-progress") {
          if (!isSnakeRunning) setIsSnakeRunning(true);
          // Prevent changing direction if currently moving rightwards
          if (snakeDirection !== "right") snakeDirection = "left";
        }
        break;
      case "right":
        if (gameStatus === "in-progress") {
          if (!isSnakeRunning) setIsSnakeRunning(true);
          // Prevent changing direction if currently moving leftwards
          if (snakeDirection !== "left") snakeDirection = "right";
        }
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="gameScreen flex max-h-svh min-h-svh w-full flex-col justify-between gap-2 overflow-hidden bg-gradient-to-r from-[#614385] to-[#516395]"
      ref={GameScreenRef}
    >
      {/* Game score and controls */}
      <GameBoardHeader />

      {/* Game board */}
      <div className="gameBoard relative self-center border-2 md:mb-6">
        {/* Canvas */}
        <canvas
          width={CanvasWidth}
          height={CanvasWidth}
          ref={CanvasRef}
        ></canvas>

        {/* Press key to start message */}
        {!isSnakeRunning && gameStatus !== "game-over" && (
          <div
            className="presskeytostart absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-semibold text-slate-200 "
            style={{ whiteSpace: "nowrap" }}
          >
            Press control keys to start
          </div>
        )}

        {/* Game over popup */}
        {gameStatus === "game-over" && (
          <GameOverPopup playAgainHandler={playAgainHandler} />
        )}
      </div>

      {/* Button controls */}
      <GameBtnControls handleControlsBtnClick={handleControlsBtnClick} />
    </div>
  );
};

export default GamePlayBoard;
