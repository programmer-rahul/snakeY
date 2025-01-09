import { Layer, Rect } from "react-konva";

const RenderSnakeBoardBg = ({ gameBoardWidth }: { gameBoardWidth: number }) => {
  return (
    <Layer>
      <Rect
        width={gameBoardWidth}
        height={gameBoardWidth}
        fill={"rgb(34,29,42)"}
      />
    </Layer>
  );
};

export default RenderSnakeBoardBg;
