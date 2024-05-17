import { useEffect, useRef, useState } from "react";
import { useSnake } from "../../context/SnakeContext";
import {
  drawCanvasBg,
  drawSnakeFoodOnCanvas,
  drawSnakeOnCanvas,
} from "../../utils/canvas";
import GameOverPopup from "./GameOverPopup";
import GameBtnControls from "../reusable/GameBtnControls";

type SnakeDirectionType = "left" | "right" | "up" | "down";
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
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [CanvasWidth, setCanvasWidth] = useState(300);
  const [isSnakeRunning, setIsSnakeRunning] = useState(false);
  const snakeRef = useRef(isSnakeRunning);

  // variables
  let cellSize = CanvasWidth / 20;
  let snake = [{ x: 0, y: 0 }];
  let snakeFood = { x: cellSize * 10, y: cellSize * 10 };
  let frame = 0;

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
    });

    if (frame % 10 === 0) {
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
      drawSnakeFoodOnCanvas({
        x: snakeFood.x,
        y: snakeFood.y,
        context,
        cellSize,
      });
      addSnakeTail();
      userScore += 5;
      setUserScore(userScore);
    }
  };

  // to calcultate snake collistions
  const calculateSnakeCollition = () => {
    const snakeHead = { ...snake[0] };

    // if snake touches to the boundary of canvas
    if (
      snakeHead.x < 0 ||
      snakeHead.x > CanvasWidth ||
      snakeHead.y < 0 ||
      snakeHead.y > CanvasWidth
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

  // Set up canvas dimensions and key event listener
  useEffect(() => {
    // Calculate initial canvas dimensions
    const windowHeight = window.innerHeight - 200;
    const windowWidth = window.innerWidth;
    // Set canvas dimensions based on window size
    if (window.innerWidth > windowHeight) {
      if (!CanvasRef.current) return;
      CanvasRef.current.width = windowHeight - (windowHeight % 10) - 20;
      CanvasRef.current.height = windowHeight - (windowHeight % 10) - 20;
      setCanvasWidth(CanvasRef.current.width);
    } else {
      if (!CanvasRef.current) return;
      CanvasRef.current.width = windowWidth - (windowWidth % 10) - 20;
      CanvasRef.current.height = windowWidth - (windowWidth % 10) - 20;
      setCanvasWidth(CanvasRef.current.width);
    }
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
    console.log(gameStatus);
    console.log(isSnakeRunning);
    console.log("key press");

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
  };

  return (
    <div className="gameScreen flex min-h-screen flex-col justify-between gap-2 border bg-gray-800">
      {/* Game score and controls */}
      <div className="scores flex min-h-[50px] w-full justify-between border border-slate-500 p-2">
        {/* Back and sound controls */}
        <div className="flex items-center gap-4">
          <div className="goBack w-8 bg-white">B</div>
          <div className="soundControl w-8 bg-white">S</div>
        </div>
        {/* Score and high score */}
        <div className="flex items-center gap-8">
          <div className="score w-8 bg-white">{userScore}</div>
          <div className="highScore w-8 bg-white">{userHighScore}</div>
        </div>
      </div>
      {/* Game board */}
      <div className="gameBoard relative self-center border border-purple-600">
        {/* Canvas */}
        <canvas
          width={CanvasWidth}
          height={CanvasWidth}
          className="border"
          ref={CanvasRef}
        ></canvas>

        {/* Press key to start message */}
        {!isSnakeRunning && gameStatus !== "game-over" && (
          <div
            className="presskeytostart absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-semibold text-slate-200"
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
      <GameBtnControls />
    </div>
  );
};

export default GamePlayBoard;
