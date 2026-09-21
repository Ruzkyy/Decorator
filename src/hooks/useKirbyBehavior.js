// Controlador: máquina de estados y drag-and-drop de Kirby, preservada tal cual.
import { useEffect, useRef, useState } from "react";
 
export function useKirbyBehavior({
  targetPos,
  onReachTarget,
  onChatArrive,
  onWakeUp,
  chatOpen,
  chatPending,
  onToggleChat,
}) {
  const [pos, setPos] = useState({ x: 0, y: -2000 });
  const [config, setConfig] = useState({ dir: 1, scale: 1 });
  const [state, setState] = useState("drop");
  const [isDragging, setIsDragging] = useState(false);
 
  const isFirstRender = useRef(true);
  const wasChatOpen = useRef(false);
  const onReachTargetRef = useRef(onReachTarget);
  const onChatArriveRef = useRef(onChatArrive);
  const onWakeUpRef = useRef(onWakeUp);
 
  useEffect(() => {
    onReachTargetRef.current = onReachTarget;
    onChatArriveRef.current = onChatArrive;
    onWakeUpRef.current = onWakeUp;
  }, [onReachTarget, onChatArrive, onWakeUp]);
 
  useEffect(() => {
    if (chatOpen) {
      setIsDragging(false);
      setState("idle");
    } else if (wasChatOpen.current) {
      setState("wander");
    }
    wasChatOpen.current = chatOpen;
  }, [chatOpen]);
 
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setPos((p) => ({ ...p, y: -window.innerHeight }));
      return;
    }
  }, []);
 
  useEffect(() => {
    if (targetPos && !isDragging) {
      if (chatPending || state === "sleep" || state === "drop_sleep" || state === "wander" || state === "bye") {
        const isAir = targetPos.y < -100;
        setState(isAir ? "fly" : "run");
      }
    }
  }, [targetPos, chatPending, isDragging, state]);
 
  useEffect(() => {
    if (chatOpen) return;
    if (isDragging) return;
 
    let interval;
    const wanderBoundary = window.innerWidth / 2 - 100;
    const groundY = 0;
 
    if (state === "drop") {
      interval = setInterval(() => {
        setPos((prev) => {
          if (prev.y >= groundY - 20) {
            setState(targetPos ? "run" : "wander");
            return { ...prev, y: groundY };
          }
          return {
            x: prev.x + Math.sin(Date.now() * 0.002) * 2.3,
            y: prev.y + 2.5,
          };
        });
      }, 16);
    } else if (state === "wander") {
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
            setConfig((c) => ({ ...c, dir: newDir }));
          }
          return { ...prev, x: prev.x + (newDir * 2), y: groundY };
        });
      }, 16);
    } else if (state === "run" || state === "fly") {
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
              if (onChatArriveRef.current) onChatArriveRef.current();
            } else {
              setState("change");
              if (onReachTargetRef.current) onReachTargetRef.current();
            }
            return { x: targetPos.x, y: targetY };
          }
 
          const speed = state === "fly" ? 8 : 6;
          const newDir = distX > 0 ? 1 : (distX < 0 ? -1 : config.dir);
          if (newDir !== config.dir) {
            setConfig((c) => ({ ...c, dir: newDir }));
          }
 
          const moveX = (distX / dist) * speed;
          const moveY = (distY / dist) * speed;
 
          return { x: prev.x + moveX, y: prev.y + moveY };
        });
      }, 16);
    } else if (state === "change") {
      const timeout = setTimeout(() => {
        setState("drop_sleep");
      }, 1200);
      return () => clearTimeout(timeout);
    } else if (state === "drop_sleep") {
      interval = setInterval(() => {
        setPos((prev) => {
          if (prev.y >= groundY - 20) {
            setState("sleep");
            return { ...prev, y: groundY };
          }
          return {
            x: prev.x,
            y: prev.y + 3.0,
          };
        });
      }, 16);
    } else if (state === "sleep") {
      const timeout = setTimeout(() => {
        if (onWakeUpRef.current) onWakeUpRef.current();
        setState("wander");
      }, 10000);
      return () => clearTimeout(timeout);
    }
 
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state, targetPos, isDragging, config.dir, chatOpen, chatPending]);
 
  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      setPos({
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight + 120,
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
 
  const handleMouseDown = (e) => {
    if (e.button === 0 && !chatOpen) {
      setIsDragging(true);
      setState("bye");
    }
  };
 
  const handleDoubleClick = () => {
    setIsDragging(false);
    onToggleChat();
  };
 
  return { pos, state, config, isDragging, handleMouseDown, handleDoubleClick };
}