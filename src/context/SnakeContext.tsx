import { createContext, ReactNode, useContext, useState } from "react";

type GameStatusType = "idle" | "in-progress" | "game-over";

interface ContextInterface {
  gameStatus: GameStatusType;
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatusType>>;

  userScore: number;
  setUserScore: React.Dispatch<React.SetStateAction<number>>;

  userHighScore: number;
  setUserHighScore: React.Dispatch<React.SetStateAction<number>>;
}

const SnakeContext = createContext<ContextInterface>({
  gameStatus: "idle",
  setGameStatus: () => null,

  userScore: 0,
  setUserScore: () => null,

  userHighScore: 0,
  setUserHighScore: () => null,
});

const useSnake = () => useContext(SnakeContext);

const SnakeProvider = ({ children }: { children: ReactNode }) => {
  const [gameStatus, setGameStatus] = useState<GameStatusType>("idle");

  const [userScore, setUserScore] = useState(0);
  const [userHighScore, setUserHighScore] = useState(() => {
    const highScore = localStorage.getItem("snakeGameHighScore");
    console.log("highScore", highScore);
    return highScore ? parseInt(highScore) : 0;
  });

  return (
    <SnakeContext.Provider
      value={{
        gameStatus,
        setGameStatus,
        userScore,
        setUserScore,
        userHighScore,
        setUserHighScore,
      }}
    >
      {children}
    </SnakeContext.Provider>
  );
};

export { SnakeProvider, useSnake };
