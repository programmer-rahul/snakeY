import { Stage, Layer } from "react-konva";
import GameOverPopup from "../GameOverPopup";

import RenderSnake from "./canvas/RenderSnake";
import RenderSnakeBoardBg from "./canvas/RenderSnakeBoardBg";
import RenderSnakeFood from "./canvas/RenderSnakeFood";
import useSnake from "../../../hooks/useSnake";

const SnakeGamePlayBoard = ({
  screenWindowRef,
}: {
  screenWindowRef: React.RefObject<HTMLDivElement>;
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
    isSnakeRunning,
  } = useSnake({ screenWindowRef: screenWindowRef });

  return (
    <>
      <div
        className="gameBoard relative self-center border-2 md:mb-6"
        style={{ opacity: gameStatus === "in-progress" ? 1 : 0.5 }}
      >
        {/* Game Canvas */}
        <Stage width={gameBoardWidth} height={gameBoardWidth} ref={canvasRef}>
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
