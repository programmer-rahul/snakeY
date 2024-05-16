import { useEffect, useRef, useState } from "react";

type GameStatusType = "idle" | "in-progress" | "game-over";

const SnakeGame = () => {
  const CanvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  const [CanvasWidth, setCanvasWidth] = useState(300);

  const [gameStatus, setGameStatus] = useState<GameStatusType>("idle");

  let cellSize = CanvasWidth / 16;

  const drawCanvasBg = () => {
    console.log(ctx);
    if (!ctx) return;

    for (let x = 0; x < cellSize; x++) {
      for (let y = 0; y < cellSize; y++) {
        ctx.fillStyle = "rgb(34,29,42)";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        ctx.strokeStyle = "rgb(32,42,70)";
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  };

  //   to set canvas width and height based on screen width and height
  useEffect(() => {
    console.log("window width :- ", window.innerWidth);
    console.log("window height :- ", window.innerHeight - 200);
    const windowHeight = window.innerHeight - 200;
    const windowWidth = window.innerWidth;

    if (window.innerWidth > windowHeight) {
      if (!CanvasRef.current) return;
      CanvasRef.current.width = windowHeight - (windowHeight % 10) - 20;
      CanvasRef.current.height = windowHeight - (windowHeight % 10) - 20;

      setCanvasWidth(CanvasRef.current.width);
      console.log("canvas width :- ", CanvasRef.current.width);
    } else {
      if (!CanvasRef.current) return;
      CanvasRef.current.width = windowWidth - (windowWidth % 10) - 20;
      CanvasRef.current.height = windowWidth - (windowWidth % 10) - 20;

      setCanvasWidth(CanvasRef.current.width);
      console.log("canvas width :- ", CanvasRef.current.width);
    }
  }, []);

  useEffect(() => {
    const ctx = CanvasRef.current?.getContext("2d");
    ctx && setCtx(ctx);

    drawCanvasBg();
  }, []);

  return (
    <div className="max-h-screen min-h-screen w-screen bg-slate-300">
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
      {/* <div className="gameScreen flex min-h-screen flex-col justify-between gap-2 border bg-gray-800">
        <div className="scores flex min-h-[50px] w-full justify-between border border-slate-500 p-2">
          <div className="flex items-center gap-4">
            <div className="goBack w-8 bg-white">B</div>
            <div className="soundControl w-8 bg-white">S</div>
          </div>
          <div className="flex items-center gap-8">
            <div className="score w-8 bg-white">30</div>
            <div className="highScore w-8 bg-white">40</div>
          </div>
        </div>

        <div className="gameBoard borde self-center border-purple-600">
          <canvas
            width={CanvasWidth}
            height={CanvasWidth}
            className="border"
            ref={CanvasRef}
          ></canvas>
        </div>
        <div className="bntControls min-h-[150px] w-full bg-rose-300"></div>
      </div> */}
    </div>
  );
};
export default SnakeGame;
