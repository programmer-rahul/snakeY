import { useEffect, useRef, useState } from "react";
import { useSnake } from "../context/SnakeContext";
import {
  drawCanvasBg,
  drawSnakeFoodOnCanvas,
  drawSnakeOnCanvas,
} from "../utils/canvas";

type SnakeDirectionType = "left" | "right" | "up" | "down";
let snakeDirection: SnakeDirectionType = "right";

const GamePlayBoard = () => {
  // context
  const { gameStatus } = useSnake();

  //   states
  const CanvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [CanvasWidth, setCanvasWidth] = useState(300);
  const [isSnakeRunning, setIsSnakeRunning] = useState(false);

  // variables
  let cellSize = CanvasWidth / 20;
  let snake = [{ x: 2 * cellSize, y: 2 * cellSize }];
  let snakeFood = { x: cellSize * 10, y: cellSize * 10 };
  let frame = 0;

  //   to animate canvas on every frame
  const animateCanvas = () => {
    if (!context || !isSnakeRunning) return;

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
      snake = [newHeadPosition];
    }

    frame++;
    requestAnimationFrame(animateCanvas);
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
    // Add keydown event listener for handling user inputs
    window.addEventListener("keydown", handleUserKeyInput);
    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleUserKeyInput);
    };
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
      animateCanvas();
    }
  }, [isSnakeRunning]);

  // Handle user inputs
  const handleUserKeyInput = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
        if (gameStatus === "in-progress" && !isSnakeRunning) {
          setIsSnakeRunning(true);
          snakeDirection = event.key
            .replace("Arrow", "")
            .toLowerCase() as SnakeDirectionType;
        }
        break;
      default:
        break;
    }
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
          <div className="score w-8 bg-white">30</div>
          <div className="highScore w-8 bg-white">40</div>
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
        {!isSnakeRunning && (
          <div
            className="presskeytostart absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-semibold text-slate-200"
            style={{ whiteSpace: "nowrap" }}
          >
            Press control keys to start
          </div>
        )}
      </div>
      {/* Button controls */}
      <div className="bntControls min-h-[150px] w-full bg-rose-300"></div>
    </div>
  );
};

export default GamePlayBoard;
