import { useEffect, useRef, useState } from "react";
import { useSnake } from "../context/SnakeContext";

// we declared them here because we dont't want them to reset when state changes
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

  //   variables
  let cellSize = CanvasWidth / 20;
  let snake = [{ x: 2 * cellSize, y: 2 * cellSize }];
  let frame = 1;

  //   functions
  const drawCanvasBg = () => {
    if (!context) return;
    console.log("inside drawCanvasBg");

    for (let x = 0; x < cellSize; x++) {
      for (let y = 0; y < cellSize; y++) {
        context.fillStyle = "rgb(34,29,42)";
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        context.strokeStyle = "rgb(32,42,70)";
        context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  };
  const drawSnakeOnCanvas = () => {
    if (!context) return;

    context.shadowColor = "rgb(226 232 240)";
    context.shadowBlur = 10;

    context.fillStyle = "rgb(226 232 240)";
    context.fillRect(snake[0].x, snake[0].y, cellSize, cellSize);

    context.shadowColor = "transparent";
    context.shadowBlur = 0;
  };

  const animateCanvas = () => {
    if (!context) return;
    console.log("inside animateCanvas");

    if (!isSnakeRunning) return;

    context.clearRect(0, 0, CanvasWidth, CanvasWidth);

    // redraw canvas grid
    drawCanvasBg();
    // draw snake on canvas
    drawSnakeOnCanvas();

    // draw food on canvas

    console.log("direction: " + snakeDirection);
    if (frame % 20 === 0) {
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

      snake[0] = snakeHead;
    }
    frame++;

    requestAnimationFrame(animateCanvas);
  };

  //   to set canvas width and height based on screen width and height
  useEffect(() => {
    // console.log("window width :- ", window.innerWidth);
    // console.log("window height :- ", window.innerHeight - 200);
    const windowHeight = window.innerHeight - 200;
    const windowWidth = window.innerWidth;

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
    //   console.log("canvas width :- ", CanvasRef.current.width);

    // add event listener for user clicks
    window.addEventListener("keydown", handleUserKeyInput);
    return () => {
      window.removeEventListener("keydown", handleUserKeyInput);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   to render canvas grid on component load
  useEffect(() => {
    if (!context) {
      const ctx = CanvasRef.current?.getContext("2d");
      //   console.log("ctx");
      ctx && setContext(ctx);
    }
    if (context) {
      drawCanvasBg();
      drawSnakeOnCanvas();
    }
  }, [context]);

  //   to start game is isSnakeRunning is true
  useEffect(() => {
    if (isSnakeRunning) {
      animateCanvas();
    }
  }, [isSnakeRunning]);

  //   to handle user key input
  const handleUserKeyInput = (event: KeyboardEvent) => {
    console.log(event.key);
    switch (event.key) {
      case "ArrowUp":
        gameStatus === "in-progress" &&
          !isSnakeRunning &&
          setIsSnakeRunning(true);
        snakeDirection = "up";
        break;
      case "ArrowDown":
        gameStatus === "in-progress" &&
          !isSnakeRunning &&
          setIsSnakeRunning(true);
        snakeDirection = "down";
        break;
      case "ArrowLeft":
        gameStatus === "in-progress" &&
          !isSnakeRunning &&
          setIsSnakeRunning(true);
        snakeDirection = "left";
        break;
      case "ArrowRight":
        gameStatus === "in-progress" &&
          !isSnakeRunning &&
          setIsSnakeRunning(true);
        snakeDirection = "right";
        break;
    }
  };

  return (
    <div className="gameScreen flex min-h-screen flex-col justify-between gap-2 border bg-gray-800">
      <div className="scores flex min-h-[50px] w-full justify-between border border-slate-500 p-2">
        <div className="flex items-center gap-4">
          <div className="goBack w-8 bg-white">B</div>
          <div className="soundControl w-8 bg-white">S</div>
        </div>
        <div className="flex items-center gap-8">
          <div className="score w-8 bg-white">30</div>
          <div className="highScore w-8 bg-white">40</div>
        </div>
      </div>

      <div className="gameBoard relative self-center border border-purple-600">
        <canvas
          width={CanvasWidth}
          height={CanvasWidth}
          className="border"
          ref={CanvasRef}
        ></canvas>
        {!isSnakeRunning && (
          <div
            className="presskeytostart absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-semibold text-slate-200"
            style={{ whiteSpace: "nowrap" }}
          >
            Press control keys to start
          </div>
        )}
      </div>
      <div className="bntControls min-h-[150px] w-full bg-rose-300"></div>
    </div>
  );
};
export default GamePlayBoard;
