"use client";

import { useEffect, useState } from "react";

const FLOAT_SCROLL_THRESHOLD = 100;

export default function DirectionButton() {
  const [pastLocation, setPastLocation] = useState(false);
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const target = document.getElementById("location");
    if (!target) return;

    function update() {
      const offsetTop = target!.getBoundingClientRect().top + window.scrollY;
      setPastLocation(window.scrollY > offsetTop);
      setIsFloating(window.scrollY >= FLOAT_SCROLL_THRESHOLD);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="fixed bottom-[30px] left-1/2 z-[999] -translate-x-1/2">
      <a
        href="#location"
        className={`flex items-center gap-[10px] rounded-[41px] bg-white px-[10px] py-[7px] font-batang text-[14px] text-black drop-shadow-[0px_4px_7px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-out ${
          isFloating ? "animate-float-button" : ""
        }`}
      >
        오시는 길
        <span
          className={`inline-flex transition-transform duration-500 ease-in-out ${
            pastLocation ? "rotate-180" : ""
          }`}
        >
          <svg
            viewBox="0 0 10 14"
            className="h-[14px] w-[10px] origin-center animate-arrow-nod"
            fill="none"
            aria-hidden
          >
            <path
              d="M5 14L0 9.1L1 8.1025L4.28571 11.3225V6.3H5.71429V11.3225L9 8.12L10 9.1L5 14ZM4.28571 4.9V2.8H5.71429V4.9H4.28571ZM4.28571 1.4V0H5.71429V1.4H4.28571Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </a>
    </div>
  );
}
