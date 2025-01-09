import { Stage, Layer } from "react-konva";
import GameOverPopup from "../GameOverPopup";

import RenderSnake from "./canvas/RenderSnake";
import RenderSnakeBoardBg from "./canvas/RenderSnakeBoardBg";
import RenderSnakeFood from "./canvas/RenderSnakeFood";
import useSnake, { SnakeDirectionType } from "../../../hooks/useSnake";
import { Dispatch, SetStateAction, useState } from "react";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";

const SnakeGamePlayBoard = ({
  screenWindowRef,
  isSnakeRunning,
  setIsSnakeRunning,
  snakeDirectionRef,
}: {
  screenWindowRef: React.RefObject<HTMLDivElement>;
  isSnakeRunning: boolean;
  setIsSnakeRunning: Dispatch<SetStateAction<boolean>>;
  snakeDirectionRef: React.MutableRefObject<SnakeDirectionType>;
}) => {
  const {
    gameBoardWidth,
    canvasRef,
    cellSize,
    gameStatus,
    snakeFood,
    snakeFoodColorIndex,
    playAgainHandler,
    snakePos,
  } = useSnake({
    screenWindowRef: screenWindowRef,
    isSnakeRunning: isSnakeRunning,
    setIsSnakeRunning: setIsSnakeRunning,
    snakeDirectionRef: snakeDirectionRef,
  });

  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null,
  );

  const handleTouchStart = (
    e: KonvaEventObject<TouchEvent, Node<NodeConfig>>,
  ) => {
    const touch = e.evt.touches[0];
    setStartPoint({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (
    e: KonvaEventObject<TouchEvent, Node<NodeConfig>>,
  ) => {
    if (!startPoint) return;

    const touch = e.evt.changedTouches[0];
    const endPoint = { x: touch.clientX, y: touch.clientY };

    // Calculate the swipe direction
    const deltaX = endPoint.x - startPoint.x;
    const deltaY = endPoint.y - startPoint.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        console.log("changed", "RIGHT");
        snakeDirectionRef.current = "RIGHT";
      } else {
        console.log("changed", "LEFT");
        snakeDirectionRef.current = "LEFT";
      }
    } else {
      if (deltaY > 0) {
        console.log("changed", "DOWN");
        snakeDirectionRef.current = "DOWN";
      } else {
        console.log("changed", "UP");
        snakeDirectionRef.current = "UP";
      }
    }

    if (!isSnakeRunning) {
      setIsSnakeRunning(true);
      snakeDirectionRef.current = "RIGHT";
    }

    setStartPoint(null);
  };

  return (
    <>
      <div
        className="gameBoard relative self-center border-2 border-zinc-400/60 md:mb-6"
        style={{ opacity: gameStatus === "in-progress" ? 1 : 0.8 }}
      >
        {/* Game Canvas */}
        <Stage
          width={gameBoardWidth}
          height={gameBoardWidth}
          ref={canvasRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* bg layer  */}
          <RenderSnakeBoardBg gameBoardWidth={gameBoardWidth} />

          {/* player layer  */}
          <Layer>
            {/* snake food  */}
            <RenderSnakeFood
              cellSize={cellSize}
              snakeFood={snakeFood}
              snakeFoodColorIndex={snakeFoodColorIndex}
            />

            {/* snakePos  */}
            <RenderSnake cellSize={cellSize} snakePos={snakePos} />
          </Layer>
        </Stage>
      </div>
      {/* Press key to start message */}
      {!isSnakeRunning && gameStatus !== "game-over" && <StartGameMessage />}

      {/* Game over popup */}
      {gameStatus === "game-over" && (
        <GameOverPopup playAgainHandler={playAgainHandler} />
      )}
    </>
  );
};

export default SnakeGamePlayBoard;

const StartGameMessage = () => {
  return (
    <div
      className="presskeytostart absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold text-slate-200"
      style={{ whiteSpace: "nowrap" }}
    >
      Press any key to start
    </div>
  );
};
