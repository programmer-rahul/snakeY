import { Dispatch, SetStateAction } from "react";
import { SnakeDirectionType } from "../../../hooks/useSnake";

const GameBtnControls = ({
  isSnakeRunning,
  setIsSnakeRunning,
  snakeDirectionRef,
}: {
  isSnakeRunning: boolean;
  setIsSnakeRunning: Dispatch<SetStateAction<boolean>>;
  snakeDirectionRef: React.MutableRefObject<SnakeDirectionType>;
}) => {
  // handler for controlbtn
  const handleControlsBtnClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    switch (event.currentTarget.ariaLabel) {
      case "UP":
        if (snakeDirectionRef.current !== "DOWN")
          snakeDirectionRef.current = "UP";
        break;
      case "DOWN":
        if (snakeDirectionRef.current !== "UP")
          snakeDirectionRef.current = "DOWN";
        break;
      case "LEFT":
        if (snakeDirectionRef.current !== "RIGHT")
          snakeDirectionRef.current = "LEFT";
        break;
      case "RIGHT":
        if (snakeDirectionRef.current !== "LEFT")
          snakeDirectionRef.current = "RIGHT";
        break;
      default:
        break;
    }
    if (!isSnakeRunning) {
      setIsSnakeRunning(true);
      snakeDirectionRef.current = "RIGHT";
    }
  };

  return (
    <div className="mx-auto grid h-48 max-h-52 w-48 max-w-52 grid-cols-3 grid-rows-3 place-content-center place-items-center rounded-md border bg-zinc-500/50 p-2 sm:hidden">
      <ControlBtn rotate={0} handleControlsBtnClick={handleControlsBtnClick} />

      <ControlBtn rotate={90} handleControlsBtnClick={handleControlsBtnClick} />
      <ControlBtn
        rotate={180}
        handleControlsBtnClick={handleControlsBtnClick}
      />
      <ControlBtn
        rotate={270}
        handleControlsBtnClick={handleControlsBtnClick}
      />
    </div>
  );
};
export default GameBtnControls;

const ControlBtn = ({
  rotate,
  handleControlsBtnClick,
}: {
  rotate: 0 | 90 | 180 | 270;
  handleControlsBtnClick: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
}) => {
  let type: SnakeDirectionType = "RIGHT";
  let gridAlign = {
    gridColumn: 1,
    gridRow: 1,
  };

  if (rotate === 0) {
    gridAlign.gridColumn = 1;
    gridAlign.gridRow = 2;
    type = "LEFT";
  }
  if (rotate === 90) {
    gridAlign.gridColumn = 2;
    gridAlign.gridRow = 1;
    type = "UP";
  }
  if (rotate === 180) {
    gridAlign.gridColumn = 3;
    gridAlign.gridRow = 2;
    type = "RIGHT";
  }
  if (rotate === 270) {
    gridAlign.gridColumn = 2;
    gridAlign.gridRow = 3;
    type = "DOWN";
  }

  return (
    <div
      style={gridAlign}
      className="h-full cursor-pointer rounded-md bg-zinc-200/80 hover:bg-zinc-100"
      onClick={handleControlsBtnClick}
      aria-label={type}
    >
      <svg
        fill="rgb(34,29,42,.6)"
        viewBox="0 0 56 56"
        transform={`rotate(${rotate + 90})`}
        className="h-full w-full"
      >
        <path d="M 46.6445 11.7109 C 46.6445 9.9766 45.3320 8.8984 43.2695 8.8984 L 12.7305 8.8750 C 10.6914 8.8750 9.3555 9.9531 9.3555 11.6875 C 9.3555 12.6250 9.7773 13.3984 10.2695 14.3828 L 24.8711 44.5000 C 25.8554 46.4922 26.7695 47.1250 28.0117 47.1250 C 29.2305 47.1250 30.1445 46.4922 31.1289 44.5000 L 45.7305 14.3828 C 46.2227 13.4219 46.6445 12.6484 46.6445 11.7109 Z"></path>
      </svg>
    </div>
  );
};
