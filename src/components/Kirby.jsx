import idleGif from "../assets/kirbyAssets/kirby-tieso.gif";
import walkGif from "../assets/kirbyAssets/kirby-walk.gif";
import runGif from "../assets/kirbyAssets/kirby-run.gif";
import sleepGif from "../assets/kirbyAssets/kirby-sleeping.gif";
import byeGif from "../assets/kirbyAssets/kirby-bye.gif";
import downGif from "../assets/kirbyAssets/kirby-down.gif";
import changeGif from "../assets/kirbyAssets/kirby-change.gif";
import flyGif from "../assets/kirbyAssets/kirby-fly.gif";
import { useKirbyBehavior } from "../hooks/useKirbyBehavior";

export default function Kirby({
  targetPos,
  onReachTarget,
  onChatArrive,
  onWakeUp,
  chatOpen,
  onToggleChat,
  chatPending,
}) {
  const { pos, state, config, isDragging, handleMouseDown, handleDoubleClick } = useKirbyBehavior({
    targetPos,
    onReachTarget,
    onChatArrive,
    onWakeUp,
    chatOpen,
    chatPending,
    onToggleChat,
  });

  const assets = {
    idle: idleGif,
    walk: walkGif,
    run: runGif,
    sleep: sleepGif,
    bye: byeGif,
    drop: downGif,
    change: changeGif,
    fly: flyGif,
    wander: walkGif,
    drop_sleep: downGif,
  };

  const getStyle = (st) => {
    let width = "96px";
    let transformY = "";

    if (st === "walk" || st === "wander") {
      width = "135px";
      transformY = "translateY(24px)";
    } else if (st === "run") {
      width = "100px";
      transformY = "translateY(6px)";
    } else if (st === "idle") {
      width = "108px";
      transformY = "translateY(10px)";
    } else if (st === "drop" || st === "drop_sleep") {
      width = "150px";
    } else if (st === "change") {
      width = "85px";
    } else if (st === "fly") {
      width = "110px";
      transformY = "translateY(10px)";
    } else if (st === "sleep") {
      width = "96px";
    }

    return {
      width,
      transform: `scale(${config.scale}) scaleX(${config.dir}) ${transformY}`,
      imageRendering: "pixelated",
    };
  };

  return (
    <div
      className="fixed bottom-0 left-1/2 z-40 pointer-events-none"
      style={{
        transform: `translateX(-50%) translate(${pos.x}px, ${pos.y}px)`,
      }}
    >
      <div
        className={`w-40 h-56 flex items-end justify-center pointer-events-auto ${isDragging ? "cursor-grabbing" : "cursor-pointer"}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <img src={assets[state]} alt="Kirby" style={getStyle(state)} />
      </div>
    </div>
  );
}
