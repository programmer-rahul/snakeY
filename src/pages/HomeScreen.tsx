import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

const HomeScreen = () => {
  const navigate = useNavigate();

  const startHandle = () => {
    navigate("/play");
  };

  return (
    <div className="welcomeScreen flex h-svh max-h-svh w-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-600 to-zinc-800 ">
      <div className="hidde flex h-3/5 w-4/5 flex-col items-center justify-center gap-8 rounded-xl bg-gray-300 p-2 shadow-2xl md:w-[32rem]">
        <div className="space-y-4">
          <h2 className="text-center text-3xl font-bold text-gray-800 sm:text-6xl">
            Snake Game
          </h2>
          <p className="w-full px-2 text-center text-base leading-5 text-zinc-800 sm:text-xl">
            Enjoy the classic Snake game. Navigate your snake to eat food and
            grow longer.
          </p>
        </div>

        <div className="buttons flex w-full flex-col gap-2">
          <Button text="Play" onClick={startHandle} icon="playIcon" />
        </div>
      </div>
    </div>
  );
};
export default HomeScreen;
