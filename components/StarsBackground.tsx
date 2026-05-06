"use client";

import { useEffect, useRef } from "react";

export function StarsBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const starsContainer = ref.current;
    if (!starsContainer) return;

    const starCount = 200;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.classList.add("star");

      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 2 + 1;
      const duration = Math.random() * 3 + 2;
      const opacity = Math.random() * 0.7 + 0.3;

      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.setProperty("--duration", `${duration}s`);
      star.style.setProperty("--opacity", String(opacity));

      fragment.appendChild(star);
    }

    starsContainer.appendChild(fragment);

    return () => {
      starsContainer.replaceChildren();
    };
  }, []);

  return <div className="stars" ref={ref} aria-hidden />;
}
