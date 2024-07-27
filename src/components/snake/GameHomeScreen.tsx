import { useSnake } from "../../context/SnakeContext";
import Button from "../ui/Button";
import gsSound from "../../assets/gamestart.mp3";

const GameHomeScreen = () => {
  const { setGameStatus } = useSnake();

  const gameStart = new Howl({ src: [gsSound.toString()] });

  const startHandle = () => {
    setGameStatus("in-progress");
    gameStart.play();
  };

  return (
    <div className="welcomeScreen pattern flex h-screen flex-col items-center justify-center bg-gradient-to-r from-[#614385] to-[#516395]">
      <div className="flex w-auto flex-col items-center gap-8 rounded-xl bg-gray-300 px-8 py-40 shadow-2xl">
        <div className="space-y-4">
          <h2 className="text-6xl font-bold text-gray-800">Snake Game</h2>
          <p className="w-96 text-center leading-5 text-zinc-800">
            Enjoy the classic Snake game. Navigate your snake to eat food and
            grow longer. Avoid hitting the walls or yourself!
          </p>
        </div>

        <div className="buttons flex w-full flex-col gap-2">
          <Button text="Play" onClick={startHandle} icon="playIcon" />
        </div>
      </div>
    </div>
  );
};
export default GameHomeScreen;
