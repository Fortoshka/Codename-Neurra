"use client";

import { useEffect, useRef, useState } from "react";

const words = ["Быстро", "Просто", "Безопасно"];

export function WordChanger() {
  const [index, setIndex] = useState(0);
  const [animClass, setAnimClass] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setAnimClass("fade-out");

      timeoutRef.current = setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setAnimClass("fade-in");

        timeoutRef.current = setTimeout(() => {
          setAnimClass("");
        }, 800);
      }, 800);
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="changing-word-container">
      <span className={`changing-word ${animClass}`} id="changingWord">
        {words[index]}
      </span>
    </div>
  );
}
