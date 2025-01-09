import { useEffect, useRef, useState } from "react";
import { useSnake } from "../../context/SnakeContext";
import { SNAKE_FOOD_COLORS } from "../../utils/canvas";
import GameOverPopup from "./GameOverPopup";
import GameBtnControls from "../reusable/GameBtnControls";
import GameBoardHeader from "./GameBoardHeader";
import { Howl } from "howler";
import goSound from "../../assets/gameover.wav";
import gsSound from "../../assets/gamestart.mp3";
import foodSound from "../../assets/food.mp3";
import { Layer, Rect, Stage } from "react-konva";
import Konva from "konva";

export type SnakeDirectionType = "left" | "right" | "up" | "down";
let snakeDirection: SnakeDirectionType = "right";

const TotalCells = 20;

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
  const [gameBoardWidth, setGameBoardWidth] = useState(400);
  const [cellSize, setCellSize] = useState(gameBoardWidth / TotalCells);
  const [isSnakeRunning, setIsSnakeRunning] = useState(false);

  let [snakePos, setSnakePos] = useState<{ x: number; y: number }[]>([]);
  let [snakeFood, setSnakeFood] = useState({ x: 0, y: 0 });
  let [snakeFoodColorIndex, setSnakeFoodColorIndex] = useState(0);

  // ref
  const canvasRef = useRef<Konva.Stage>(null);
  const GameScreenRef = useRef<HTMLDivElement>(null);
  const snakeRef = useRef(isSnakeRunning);

  // variables
  let frame = 0;

  // audio controller
  const audioController = {
    food: new Howl({ src: [foodSound.toString()] }),
    gameOver: new Howl({ src: [goSound.toString()] }),
    gameStart: new Howl({ src: [gsSound.toString()] }),
  };

  // to animate canvas on every frame
  const animateCanvas = () => {
    if (!isSnakeRunning || !snakeRef.current) return;
    if (frame % 8 === 0) {
      // calculate snake new position and update
      updateSnakePosition();

      // collision detections
      calculateSnakeFoodCollision();
      calculateSnakeCollision();
    }
    frame++;
    requestAnimationFrame(animateCanvas);
  };

  // update snakePos position on canvas
  const updateSnakePosition = () => {
    const newHeadPosition = calculateNewHeadPosition();
    snakePos.unshift(newHeadPosition);
    snakePos.pop();
    setSnakePos([...snakePos]);
  };

  // to calculate snakePos food collision
  const calculateSnakeFoodCollision = () => {
    // check if the snakeHead and food position are same
    if (snakeFood.x === snakePos[0].x && snakeFood.y === snakePos[0].y) {
      snakeFood = {
        x: cellSize * Math.floor(Math.random() * TotalCells),
        y: cellSize * Math.floor(Math.random() * TotalCells),
      };
      setSnakeFood(snakeFood);

      if (snakeFoodColorIndex >= SNAKE_FOOD_COLORS.length - 1)
        snakeFoodColorIndex = 0;
      else snakeFoodColorIndex += 1;

      // update new color for snake food
      setSnakeFoodColorIndex(snakeFoodColorIndex);

      // add new box at snake tail
      addSnakeTail();

      // update user score
      setUserScore((prev) => prev + 5);

      // play food eat sound
      audioController.food.play();
    }
  };

  // to calcultate snakePos collistions
  const calculateSnakeCollision = () => {
    const snakeHead = { ...snakePos[0] };

    // if snakePos touches to the boundary of canvas
    if (
      snakeHead.x < 0 ||
      snakeHead.x >= gameBoardWidth ||
      snakeHead.y < 0 ||
      snakeHead.y >= gameBoardWidth
    ) {
      gameOver();
      return;
    }

    // if snakePos touches one of it tails
    snakePos.slice(1).forEach((tail) => {
      if (snakeHead.x === tail.x && snakeHead.y === tail.y) {
        gameOver();
      }
    });
  };

  // game over
  const gameOver = () => {
    setGameStatus("game-over");
    setIsSnakeRunning(false);
    snakeRef.current = false;

    if (userScore >= userHighScore) {
      localStorage.setItem("snakeGameHighScore", String(userScore));
      setUserHighScore(userScore);
    }
    audioController.gameOver.play();
  };

  // to add new snakePos tail
  const addSnakeTail = () => {
    const tail = { ...snakePos[snakePos.length - 1] };
    snakePos.push(tail);
    setSnakePos([...snakePos]);
  };

  const calculateNewHeadPosition = () => {
    const snakeHead = { ...snakePos[0] };

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

  const resetSnakePosition = () => {
    setSnakePos([
      { x: cellSize * 6, y: cellSize * 3 },
      { x: cellSize * 5, y: cellSize * 3 },
      { x: cellSize * 4, y: cellSize * 3 },
    ]);
    setSnakeFood({
      x: cellSize * Math.floor(Math.random() * TotalCells),
      y: cellSize * Math.floor(Math.random() * TotalCells),
    });
  };

  // update initial snakePos and food position
  useEffect(() => {
    resetSnakePosition();
  }, [cellSize]);

  // Set up canvas dimensions
  useEffect(() => {
    const calculateCanvasDimensions = () => {
      if (!GameScreenRef.current || !canvasRef.current) return;

      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      const scoresPanel = GameScreenRef.current.children[0];
      const btnControls = GameScreenRef.current.children[2];

      let availableHeight =
        windowHeight - (scoresPanel.clientHeight + btnControls.clientHeight);

      if (windowWidth > availableHeight) {
        canvasRef.current.width(availableHeight - (availableHeight % 10) - 20);
      } else {
        canvasRef.current.width(windowWidth - (windowWidth % 10) - 20);
      }

      const gameBoardWidth = canvasRef.current.width();

      canvasRef.current.width(gameBoardWidth);
      setCellSize(gameBoardWidth / TotalCells);
      setGameBoardWidth(gameBoardWidth);
    };
    calculateCanvasDimensions();

    window.addEventListener("resize", calculateCanvasDimensions);
  }, []);

  // Start animation when snakePos is running
  useEffect(() => {
    if (isSnakeRunning) {
      snakeRef.current = true;
      animateCanvas();
      // moveSnake()
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
        console.log("statu", gameStatus);
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
    resetSnakePosition();
    setGameStatus("in-progress");
    setUserScore(0);
    setIsSnakeRunning(true);
    snakeDirection = "right";
    audioController.gameStart.play();
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
      className="gameScreen flex max-h-svh min-h-svh w-full flex-col justify-between gap-2 overflow-hidden bg-gradient-to-r from-[#614385] to-[#520395]"
      ref={GameScreenRef}
    >
      {/* Game score and controls */}
      <GameBoardHeader />

      {/* Game board */}
      <div className="gameBoard relative self-center border-2 md:mb-6">
        {/* Canvas */}
        <Stage width={gameBoardWidth} height={gameBoardWidth} ref={canvasRef}>
          {/* bg layer  */}
          <Layer>
            <Rect
              width={gameBoardWidth}
              height={gameBoardWidth}
              fill={"rgb(34,29,42)"}
            />
          </Layer>

          {/* player layer  */}
          <Layer>
            {/* food  */}
            <Rect
              width={cellSize}
              height={cellSize}
              fill={SNAKE_FOOD_COLORS[snakeFoodColorIndex]}
              x={snakeFood.x}
              y={snakeFood.y}
            />

            {/* snakePos  */}
            {snakePos?.map((pos, index) => {
              return (
                <Rect
                  key={index}
                  width={cellSize}
                  height={cellSize}
                  fill={"rgb(226, 232, 240)"}
                  x={pos.x}
                  y={pos.y}
                />
              );
            })}
          </Layer>
        </Stage>

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
