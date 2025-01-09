import { useEffect, useRef, useState } from "react";
import Konva from "konva";

import goSound from "../assets/gameover.wav";
import gsSound from "../assets/gamestart.mp3";
import foodSound from "../assets/food.mp3";

import { Howl } from "howler";
import { useGameOptions } from "../context/SnakeContext";
import { GameStatusType } from "../types/snake";
import { SNAKE_FOOD_COLORS } from "../constants/snake";

export type SnakeDirectionType = "left" | "right" | "up" | "down";

const TotalCells = 20;
let snakeDirection: SnakeDirectionType = "right";

const useSnake = ({
  screenWindowRef,
}: {
  screenWindowRef: React.RefObject<HTMLDivElement>;
}) => {
  // context
  let { userScore, setUserScore, userHighScore, setUserHighScore } =
    useGameOptions();

  //   states
  const [gameBoardWidth, setGameBoardWidth] = useState(400);
  const [cellSize, setCellSize] = useState(gameBoardWidth / TotalCells);
  const [gameStatus, setGameStatus] = useState<GameStatusType>("idle");

  let [isSnakeRunning, setIsSnakeRunning] = useState(false);
  let [snakePos, setSnakePos] = useState<{ x: number; y: number }[]>([]);
  let [snakeFood, setSnakeFood] = useState({ x: 0, y: 0 });
  let [snakeFoodColorIndex, setSnakeFoodColorIndex] = useState(0);

  // ref
  const canvasRef = useRef<Konva.Stage>(null);
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
      if (!screenWindowRef.current || !canvasRef.current) return;

      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      const scoresPanel = screenWindowRef.current.children[0];
      const btnControls = screenWindowRef.current.children[2];

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

  // Start snake game when isSnakeRunning is true
  useEffect(() => {
    if (isSnakeRunning) {
      snakeRef.current = true;
      animateCanvas();
    }
    // Add keydown event listener for handling user inputs
    window.addEventListener("keydown", handleUserKeyInput);
    return () => {
      // Remove event listener on component unmount
      window.removeEventListener("keydown", handleUserKeyInput);
    };
  }, [isSnakeRunning]);

  // Handle user inputs
  const handleUserKeyInput = (event: KeyboardEvent) => {
    // start game if not running
    if (gameStatus === "idle") {
      setGameStatus("in-progress");
      setIsSnakeRunning(true);
      isSnakeRunning = true;
    }

    if (!isSnakeRunning) return;
    switch (event.key) {
      case "ArrowUp":
        if (snakeDirection !== "down") snakeDirection = "up";
        break;
      case "ArrowDown":
        if (snakeDirection !== "up") snakeDirection = "down";
        break;
      case "ArrowLeft":
        if (snakeDirection !== "right") snakeDirection = "left";
        break;
      case "ArrowRight":
        if (snakeDirection !== "left") snakeDirection = "right";
        break;
      default:
        break;
    }
  };

  // play again btn handler
  const playAgainHandler = () => {
    resetSnakePosition();
    snakeDirection = "right";
    setGameStatus("in-progress");
    setIsSnakeRunning(true);
    setUserScore(0);
    audioController.gameStart.play();
  };

  return {
    gameBoardWidth,
    cellSize,
    gameStatus,
    isSnakeRunning,
    snakePos,
    snakeFood,
    snakeFoodColorIndex,
    canvasRef,
    setGameStatus,
    setIsSnakeRunning,
    setSnakePos,
    setSnakeFood,
    setSnakeFoodColorIndex,
    playAgainHandler,
  };
};

export default useSnake;
