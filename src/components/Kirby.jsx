import { useEffect, useState, useRef } from "react";
import idleGif from "../assets/kirbyAssets/kirby-tieso.gif";
import walkGif from "../assets/kirbyAssets/kirby-walk.gif";
import runGif from "../assets/kirbyAssets/kirby-run.gif";
import sleepGif from "../assets/kirbyAssets/kirby-sleeping.gif";
import byeGif from "../assets/kirbyAssets/kirby-bye.gif";
import downGif from "../assets/kirbyAssets/kirby-down.gif";
import changeGif from "../assets/kirbyAssets/kirby-change.gif";
import flyGif from "../assets/kirbyAssets/kirby-fly.gif";

export default function Kirby({
  targetPos,
  onReachTarget,
  onChatArrive,
  onWakeUp,
  chatOpen,
  onToggleChat,
  chatPending,
}) {
  const [pos, setPos] = useState({ x: 0, y: -2000 });
  const [config, setConfig] = useState({ dir: 1, scale: 1 });
  // States: drop, wander, run, fly, change, drop_sleep, sleep, bye
  const [state, setState] = useState("drop");
  
  const isFirstRender = useRef(true);
  const wasChatOpen = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (chatOpen) {
      setIsDragging(false);
      setState("idle");
    } else if (wasChatOpen.current) {
      setState("wander");
    }
    wasChatOpen.current = chatOpen;
  }, [chatOpen]);

  // Initial Drop Effect
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setPos(p => ({ ...p, y: -window.innerHeight }));
      return;
    }
  }, []);

  // Wake up when a new target is set
  useEffect(() => {
    if (targetPos && !isDragging) {
      if (chatPending || state === "sleep" || state === "drop_sleep" || state === "wander" || state === "bye") {
        const isAir = targetPos.y < -100;
        setState(isAir ? "fly" : "run");
      }
    }
  }, [targetPos, chatPending, isDragging, state]); // Dependemos de targetPos (que cambia al hacer clic)

  // Main Logic Loop
  useEffect(() => {
    if (chatOpen) return;
    if (isDragging) return;

    let interval;
    const wanderBoundary = window.innerWidth / 2 - 100;
    const groundY = 0; // Ajuste del piso

    if (state === "drop") {
      interval = setInterval(() => {
        setPos((prev) => {
          if (prev.y >= groundY - 20) {
            // Cuando cae inicialmente, si no hay objetivo, pasea
            setState(targetPos ? "run" : "wander");
            return { ...prev, y: groundY };
          }
          return {
            x: prev.x + Math.sin(Date.now() * 0.002) * 2.3,
            y: prev.y + 2.5 // Velocidad de caída un poco más lenta aún
          };
        });
      }, 16);
    } 
    else if (state === "wander") {
      if (targetPos) {
        const isAir = targetPos.y < -100;
        setState(isAir ? "fly" : "run");
        return;
      }
      
      interval = setInterval(() => {
        setPos((prev) => {
          let newDir = config.dir;
          if (prev.x > wanderBoundary) newDir = -1;
          if (prev.x < -wanderBoundary) newDir = 1;

          if (newDir !== config.dir) {
            setConfig(c => ({ ...c, dir: newDir }));
          }
          return { ...prev, x: prev.x + (newDir * 2), y: groundY };
        });
      }, 16);
    } 
    else if (state === "run" || state === "fly") {
      if (!targetPos) {
        setState("wander");
        return;
      }

      interval = setInterval(() => {
        setPos((prev) => {
          const distX = targetPos.x - prev.x;
          const targetY = state === "run" ? groundY : targetPos.y;
          const distY = targetY - prev.y;
          
          const dist = Math.sqrt(distX * distX + distY * distY);
          
          if (dist < 10) {
             if (chatPending) {
               if (onChatArrive) onChatArrive();
             } else {
               setState("change");
               if (onReachTarget) onReachTarget();
             }
             return { x: targetPos.x, y: targetY };
          }
          
          const speed = state === "fly" ? 8 : 6;
          const newDir = distX > 0 ? 1 : (distX < 0 ? -1 : config.dir);
          if (newDir !== config.dir) {
             setConfig(c => ({ ...c, dir: newDir }));
          }

          const moveX = (distX / dist) * speed;
          const moveY = (distY / dist) * speed;

          return { x: prev.x + moveX, y: prev.y + moveY };
        });
      }, 16);
    } 
    else if (state === "change") {
      const timeout = setTimeout(() => {
        // Después de transformarse, en vez de dormir flotando, cae para dormir en el piso
        setState("drop_sleep");
      }, 1200); 
      return () => clearTimeout(timeout);
    }
    else if (state === "drop_sleep") {
      interval = setInterval(() => {
        setPos((prev) => {
          if (prev.y >= groundY - 20) {
            setState("sleep"); // Al tocar el piso, se duerme
            return { ...prev, y: groundY };
          }
          return {
            x: prev.x, 
            y: prev.y + 3.0 // Cae hacia el suelo
          };
        });
      }, 16);
    }
    // "sleep" state no necesita intervalo, simplemente se queda ahí hasta que targetPos cambia.
    else if (state === "sleep") {
      const timeout = setTimeout(() => {
        if (onWakeUp) onWakeUp();
        setState("wander");
      }, 10000); // 10 segundos
      return () => clearTimeout(timeout);
    }

    return () => {
      if (interval) clearInterval(interval);
    };

  }, [state, targetPos, isDragging, config.dir, onReachTarget, onChatArrive, chatOpen, chatPending]);

  // Drag & Drop
  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      setPos({
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight + 120
      });
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      setState("drop");
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const assets = {
    idle: idleGif, walk: walkGif, run: runGif,
    sleep: sleepGif, bye: byeGif, drop: downGif, 
    change: changeGif, fly: flyGif, wander: walkGif,
    drop_sleep: downGif
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
       imageRendering: "pixelated"
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
        onMouseDown={(e) => {
          if (e.button === 0 && !chatOpen) {
            setIsDragging(true);
            setState("bye");
          }
        }}
        onDoubleClick={() => {
          setIsDragging(false);
          onToggleChat();
        }}
      >
        <img
          src={assets[state] || assets.idle}
          alt="Kirby"
          style={getStyle(state)}
        />
      </div>
    </div>
  );
}
