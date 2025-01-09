import { useRef } from "react";
import SnakeGameHeader from "../components/snake/header/SnakeGameHeader";
import SnakeGamePlayBoard from "../components/snake/board/SnakeGamePlayBoard";

const SnakeGameScreen = () => {
  const screenWindowRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="gameScreen flex max-h-svh min-h-svh w-full flex-col justify-between gap-2 overflow-hidden bg-gradient-to-r from-[#614385] to-[#520395]"
      ref={screenWindowRef}
    >
      {/* Snake Game Header */}
      <SnakeGameHeader />

      {/* Game board */}
      <SnakeGamePlayBoard screenWindowRef={screenWindowRef} />

      {/* Button controls */}
      <div>{/* <GameBtnControls /> */}</div>
    </div>
  );
};

export default SnakeGameScreen;
