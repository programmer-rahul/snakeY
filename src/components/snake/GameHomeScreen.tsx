import { useSnake } from "../../context/SnakeContext";

const GameHomeScreen = () => {
  const { setGameStatus } = useSnake();

  return (
    <div className="welcomeScreen flex h-screen flex-col items-center justify-start bg-slate-300">
      <h2 className="mb-40 mt-16 text-5xl font-bold text-gray-800">
        Snake Game
      </h2>
      <div className="buttons flex flex-col gap-2">
        <button
          className="rounded-md bg-lime-600 px-12 py-2 text-xl font-semibold text-slate-200"
          onClick={() => {
            setGameStatus("in-progress");
          }}
        >
          Play
        </button>
        <button className="rounded-md bg-blue-600 px-12 py-2 text-xl font-semibold text-slate-200">
          Multiplayer
        </button>
      </div>
    </div>
  );
};
export default GameHomeScreen;
