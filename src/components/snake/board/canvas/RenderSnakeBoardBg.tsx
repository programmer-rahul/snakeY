import { Layer, Rect } from "react-konva";
import { SNAKE_CANVAS_BG } from "../../../../constants/snake";

const RenderSnakeBoardBg = ({ gameBoardWidth }: { gameBoardWidth: number }) => {
  return (
    <Layer>
      <Rect
        width={gameBoardWidth}
        height={gameBoardWidth}
        fill={SNAKE_CANVAS_BG}
      />
    </Layer>
  );
};

export default RenderSnakeBoardBg;
