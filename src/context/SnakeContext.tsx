import { createContext, ReactNode, useContext, useState } from "react";

type GameStatusType = "idle" | "in-progress" | "game-over";

interface ContextInterface {
  gameStatus: GameStatusType;
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatusType>>;
}

const SnakeContext = createContext<ContextInterface>({
  gameStatus: "idle",
  setGameStatus: () => null,
});

const useSnake = () => useContext(SnakeContext);

const SnakeProvider = ({ children }: { children: ReactNode }) => {
  const [gameStatus, setGameStatus] = useState<GameStatusType>("idle");

  return (
    <SnakeContext.Provider value={{ gameStatus, setGameStatus }}>
      {children}
    </SnakeContext.Provider>
  );
};

export { SnakeProvider, useSnake };
