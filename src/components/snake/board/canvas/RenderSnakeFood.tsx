import { Rect } from "react-konva";
import { SNAKE_FOOD_COLORS } from "../../../../constants/snake";

const RenderSnakeFood = ({
  snakeFood,
  cellSize,
  snakeFoodColorIndex,
}: {
  snakeFood: { x: number; y: number };
  cellSize: number;
  snakeFoodColorIndex: number;
}) => {
  return (
    <Rect
      width={cellSize}
      height={cellSize}
      fill={SNAKE_FOOD_COLORS[snakeFoodColorIndex]}
      x={snakeFood.x}
      y={snakeFood.y}
      cornerRadius={6}
      shadowBlur={15}
      shadowColor={SNAKE_FOOD_COLORS[snakeFoodColorIndex]}
    />
  );
};

export default RenderSnakeFood;
