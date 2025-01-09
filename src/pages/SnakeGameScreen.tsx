import { useRef, useState } from "react";
import SnakeGameHeader from "../components/snake/header/SnakeGameHeader";
import SnakeGamePlayBoard from "../components/snake/board/SnakeGamePlayBoard";
import GameBtnControls from "../components/snake/controls/GameBtnControls";
import { SnakeDirectionType } from "../hooks/useSnake";

const SnakeGameScreen = () => {
  const screenWindowRef = useRef<HTMLDivElement>(null);
  let [isSnakeRunning, setIsSnakeRunning] = useState(false);
  const snakeDirectionRef = useRef<SnakeDirectionType>("RIGHT");

  return (
    <div
      className="gameScreen flex max-h-svh min-h-svh w-full select-none flex-col gap-2 overflow-hidden bg-gradient-to-b from-zinc-600 to-zinc-800"
      ref={screenWindowRef}
    >
      {/* Snake Game Header */}
      <SnakeGameHeader />

      {/* Game board */}
      <SnakeGamePlayBoard
        screenWindowRef={screenWindowRef}
        isSnakeRunning={isSnakeRunning}
        setIsSnakeRunning={setIsSnakeRunning}
        snakeDirectionRef={snakeDirectionRef}
      />

      {/* Button controls */}
      <GameBtnControls
        isSnakeRunning={isSnakeRunning}
        setIsSnakeRunning={setIsSnakeRunning}
        snakeDirectionRef={snakeDirectionRef}
      />
    </div>
  );
};

export default SnakeGameScreen;
