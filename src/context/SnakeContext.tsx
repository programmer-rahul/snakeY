import { createContext, ReactNode, useContext, useState } from "react";

interface ContextInterface {
  userScore: number;
  setUserScore: React.Dispatch<React.SetStateAction<number>>;

  userHighScore: number;
  setUserHighScore: React.Dispatch<React.SetStateAction<number>>;

  gameSound: boolean;
  setGameSound: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameOptionsContext = createContext<ContextInterface>({
  userScore: 0,
  setUserScore: () => null,

  userHighScore: 0,
  setUserHighScore: () => null,

  gameSound: true,
  setGameSound: () => null,
});

const useGameOptions = () => useContext(GameOptionsContext);

const GameOptionsProvider = ({ children }: { children: ReactNode }) => {
  const [userScore, setUserScore] = useState(0);
  const [userHighScore, setUserHighScore] = useState(() => {
    const highScore = localStorage.getItem("snakeGameHighScore");
    return highScore ? parseInt(highScore) : 0;
  });

  const [gameSound, setGameSound] = useState(true);

  return (
    <GameOptionsContext.Provider
      value={{
        userScore,
        setUserScore,
        userHighScore,
        setUserHighScore,
        gameSound,
        setGameSound,
      }}
    >
      {children}
    </GameOptionsContext.Provider>
  );
};

export { GameOptionsProvider, useGameOptions };
