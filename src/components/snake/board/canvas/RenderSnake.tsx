import { Rect } from "react-konva";
import {
  SNAKE_HEAD_COLOR,
  SNAKE_TAIL_COLOR,
} from "../../../../constants/snake";

const RenderSnake = ({
  snakePos,
  cellSize,
}: {
  snakePos: { x: number; y: number }[];
  cellSize: number;
}) => {
  return (
    <>
      {snakePos.map((pos, index) => (
        <Rect
          key={index}
          width={cellSize}
          height={cellSize}
          fill={index ? SNAKE_TAIL_COLOR : SNAKE_HEAD_COLOR}
          x={pos.x}
          y={pos.y}
          cornerRadius={6}
        />
      ))}
    </>
  );
};

export default RenderSnake;
