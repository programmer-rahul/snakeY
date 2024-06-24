import { useSnake } from "../../context/SnakeContext";
import Button from "../ui/Button";

interface GameOverPopupProps {
  playAgainHandler: () => void;
}

const GameOverPopup = ({ playAgainHandler }: GameOverPopupProps) => {
  const { userScore } = useSnake();

  return (
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
        <Button
          text="Play Again"
          icon="playAgainIcon"
          onClick={playAgainHandler}
        />
      </div>
    </div>
  );
};
export default GameOverPopup;
