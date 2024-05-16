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

  context.shadowColor = "rgb(226, 232, 240)";
  context.shadowBlur = 30;

  context.fillStyle = "rgb(226, 232, 240)";
  snake.forEach(({ x, y }) => context.fillRect(x, y, cellSize, cellSize));

  context.shadowColor = "transparent";
  context.shadowBlur = 0;
};

const drawSnakeFoodOnCanvas = ({
  x,
  y,
  context,
  cellSize,
}: {
  x: number;
  y: number;
  context: CanvasRenderingContext2D;
  cellSize: number;
}) => {
  if (!context) return;

  context.shadowColor = "rgb(147 51 234)";
  context.shadowBlur = 30;

  context.fillStyle = "rgb(147 51 234)";
  context.fillRect(x, y, cellSize, cellSize);

  context.shadowColor = "transparent";
  context.shadowBlur = 0;
};

export { drawCanvasBg, drawSnakeOnCanvas, drawSnakeFoodOnCanvas };
