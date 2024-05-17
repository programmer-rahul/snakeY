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
    console.log("animating canvas", gameStatus);
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
    setGameStatus("game-over");
    setIsSnakeRunning(false);
    snakeRef.current = false;

    console.log(userScore);
    console.log(userHighScore);

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
      snakeRef.current = true;
      animateCanvas();
    }
  }, [isSnakeRunning]);

  // Handle user inputs
  const handleUserKeyInput = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
        if (gameStatus === "in-progress" && !isSnakeRunning) {
          setIsSnakeRunning(true);
          // Prevent changing direction if currently moving downwards
          if (snakeDirection !== "down") {
            snakeDirection = "up";
          }
        }
        break;
      case "ArrowDown":
        if (gameStatus === "in-progress" && !isSnakeRunning) {
          setIsSnakeRunning(true);
          // Prevent changing direction if currently moving upwards
          if (snakeDirection !== "up") {
            snakeDirection = "down";
          }
        }
        break;
      case "ArrowLeft":
        if (gameStatus === "in-progress" && !isSnakeRunning) {
          setIsSnakeRunning(true);
          // Prevent changing direction if currently moving rightwards
          if (snakeDirection !== "right") {
            snakeDirection = "left";
          }
        }
        break;
      case "ArrowRight":
        if (gameStatus === "in-progress" && !isSnakeRunning) {
          setIsSnakeRunning(true);
          // Prevent changing direction if currently moving leftwards
          if (snakeDirection !== "left") {
            snakeDirection = "right";
          }
        }
        break;
      default:
        break;
    }
  };

  const playAgainHandler = () => {
    console.log("clicked");
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
      {/* Game over popup */}
      {gameStatus === "game-over" && (
        <div className="absolute left-1/2 top-1/2 flex min-h-80 min-w-72 -translate-x-1/2 -translate-y-1/2 flex-col justify-around gap-12 rounded-md bg-slate-200 p-6">
          <div className="text-center text-3xl font-bold text-gray-800">
            Game Over
          </div>

          <div className="score flex flex-col items-center gap-4 text-xl">
            <div className="relative w-full border border-red-500">
              <hr className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-gray-800 bg-gray-800" />
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 px-2 font-semibold text-gray-700">
                Score
              </p>
            </div>
            <p className="text-5xl font-bold text-slate-500">{userScore}</p>
          </div>

          <div className="w-full">
            <button
              className="mx-auto flex w-4/5 select-none items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-gradient-to-tr from-rose-700 to-amber-500 px-6 py-3 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-amber-700/30 transition-all hover:shadow-lg hover:shadow-amber-700/50 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={playAgainHandler}
            >
              <svg
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
                width={20}
                height={20}
              >
                <g strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    fill="currentColor"
                    d="M14.9547098,7.98576084 L15.0711,7.99552 C15.6179,8.07328 15.9981,8.57957 15.9204,9.12636 C15.6826,10.7983 14.9218,12.3522 13.747,13.5654 C12.5721,14.7785 11.0435,15.5888 9.37999,15.8801 C7.7165,16.1714 6.00349,15.9288 4.48631,15.187 C3.77335,14.8385 3.12082,14.3881 2.5472,13.8537 L1.70711,14.6938 C1.07714,15.3238 3.55271368e-15,14.8776 3.55271368e-15,13.9867 L3.55271368e-15,9.99998 L3.98673,9.99998 C4.87763,9.99998 5.3238,11.0771 4.69383,11.7071 L3.9626,12.4383 C4.38006,12.8181 4.85153,13.1394 5.36475,13.3903 C6.50264,13.9466 7.78739,14.1285 9.03501,13.9101 C10.2826,13.6916 11.4291,13.0839 12.3102,12.174 C13.1914,11.2641 13.762,10.0988 13.9403,8.84476 C14.0181,8.29798 14.5244,7.91776 15.0711,7.99552 L14.9547098,7.98576084 Z M11.5137,0.812976 C12.2279,1.16215 12.8814,1.61349 13.4558,2.14905 L14.2929,1.31193 C14.9229,0.681961 16,1.12813 16,2.01904 L16,6.00001 L12.019,6.00001 C11.1281,6.00001 10.6819,4.92287 11.3119,4.29291 L12.0404,3.56441 C11.6222,3.18346 11.1497,2.86125 10.6353,2.60973 C9.49736,2.05342 8.21261,1.87146 6.96499,2.08994 C5.71737,2.30841 4.57089,2.91611 3.68976,3.82599 C2.80862,4.73586 2.23802,5.90125 2.05969,7.15524 C1.98193,7.70202 1.47564,8.08224 0.928858,8.00448 C0.382075,7.92672 0.00185585,7.42043 0.0796146,6.87364 C0.31739,5.20166 1.07818,3.64782 2.25303,2.43465 C3.42788,1.22148 4.95652,0.411217 6.62001,0.119916 C8.2835,-0.171384 9.99651,0.0712178 11.5137,0.812976 Z"
                  ></path>
                </g>
              </svg>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePlayBoard;
