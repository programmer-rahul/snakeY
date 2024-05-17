interface DrawCanvasBg {
  cellSize: number;
  CanvasWidth: number;
  context: CanvasRenderingContext2D | null;
}

const drawCanvasBg = ({ cellSize, CanvasWidth, context }: DrawCanvasBg) => {
  if (!context) return;

  for (let x = 0; x < CanvasWidth; x += cellSize) {
    for (let y = 0; y < CanvasWidth; y += cellSize) {
      context.fillStyle = "rgb(34,29,42)";
      context.fillRect(x, y, cellSize, cellSize);
      context.strokeStyle = "rgb(32,42,70)";
      context.strokeRect(x, y, cellSize, cellSize);
    }
  }
};

const SNAKE_HEAD_COLOR = "rgb(226, 232, 240)";
const SNAKE_TAIL_COLOR = "rgb(203 213 225)";

const drawSnakeOnCanvas = ({
  snake,
  context,
  cellSize,
}: {
  snake: { x: number; y: number }[];
  context: CanvasRenderingContext2D | null;
  cellSize: number;
}) => {
  if (!context) return;

  snake.forEach(({ x, y }, index) => {
    context.shadowColor = index ? SNAKE_TAIL_COLOR : SNAKE_HEAD_COLOR;
    context.shadowBlur = index ? 10 : 20;

    context.fillStyle = index ? SNAKE_TAIL_COLOR : SNAKE_HEAD_COLOR;
    context.fillRect(x, y, cellSize, cellSize);
  });

  context.shadowColor = "transparent";
  context.shadowBlur = 0;
};

export const SNAKE_FOOD_COLORS = [
  "rgb(147 51 234)",
  "rgb(101 163 13)",
  "rgb(225 29 72)",
  "rgb(79 70 229)",
  "rgb(202 138 4)",
];

const drawSnakeFoodOnCanvas = ({
  x,
  y,
  context,
  cellSize,
  snakeColor = 0,
}: {
  x: number;
  y: number;
  context: CanvasRenderingContext2D;
  cellSize: number;
  snakeColor?: number;
}) => {
  if (!context) return;

  context.shadowColor = SNAKE_FOOD_COLORS[snakeColor];
  context.shadowBlur = 30;

  context.fillStyle = SNAKE_FOOD_COLORS[snakeColor];
  context.fillRect(x, y, cellSize, cellSize);

  context.shadowColor = "transparent";
  context.shadowBlur = 0;
};

export { drawCanvasBg, drawSnakeOnCanvas, drawSnakeFoodOnCanvas };
