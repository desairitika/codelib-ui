import { useEffect, useRef, useState } from "react";

// Simple count up hook using requestAnimationFrame.
// target: number to count to, duration: ms for animation
export default function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const to = Number(target) || 0;
    if (to === 0) {
      setValue(0);
      return;
    }

    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = Math.floor(progress * to);
      setValue(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setValue(to);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}
