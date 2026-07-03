"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

type Photo = {
  src: string;
  gridRatio: string;
  width: number;
  height: number;
};

const PHOTOS: Photo[] = [
  { src: "/images/wedding/1.png", gridRatio: "143/254", width: 281, height: 500 },
  { src: "/images/wedding/2.png", gridRatio: "143/254", width: 281, height: 500 },
  { src: "/images/wedding/3.png", gridRatio: "143/254", width: 281, height: 500 },
  { src: "/images/wedding/4.jpg", gridRatio: "143/254", width: 281, height: 500 },
  { src: "/images/wedding/5.png", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/6.jpg", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/7.jpg", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/8.jpg", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/9.png", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/10.png", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/11.png", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/12.png", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/13.png", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/14.jpg", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/15.jpg", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/16.jpg", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/17.png", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/18.jpg", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/19.jpg", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/20.jpg", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/21.png", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/22.png", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/23.png", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/24.png", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/25.jpg", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/26.png", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/27.png", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/28.png", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/29.jpg", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/30.png", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/31.png", gridRatio: "140/211", width: 333, height: 500 },
  { src: "/images/wedding/32.jpg", gridRatio: "140/211", width: 333, height: 500 },

];

const INITIAL_VISIBLE_COUNT = 10;
const SWIPE_THRESHOLD = 50;
const LIGHTBOX_REOPEN_DELAY_MS = 1000;

export default function Gallery() {
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [lightboxLocked, setLightboxLocked] = useState(false);
  const pointerStartXRef = useRef<number | null>(null);
  const unlockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visiblePhotos = expanded ? PHOTOS : PHOTOS.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = !expanded && PHOTOS.length > INITIAL_VISIBLE_COUNT;

  const showPrev = () =>
    setActiveIndex((i) => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length));
  const showNext = () =>
    setActiveIndex((i) => (i === null ? null : (i + 1) % PHOTOS.length));
  const close = () => {
    setActiveIndex(null);
    setLightboxLocked(true);
    pointerStartXRef.current = null;

    if (unlockTimeoutRef.current) {
      clearTimeout(unlockTimeoutRef.current);
    }

    unlockTimeoutRef.current = setTimeout(() => {
      setLightboxLocked(false);
      unlockTimeoutRef.current = null;
    }, LIGHTBOX_REOPEN_DELAY_MS);
  };

  function openLightbox(index: number) {
    if (lightboxLocked) return;
    setActiveIndex(index);
  }

  useEffect(() => {
    return () => {
      if (unlockTimeoutRef.current) {
        clearTimeout(unlockTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex !== null]);

  function handlePointerDown(e: PointerEvent) {
    pointerStartXRef.current = e.clientX;
  }

  function handlePointerUp(e: PointerEvent) {
    const startX = pointerStartXRef.current;
    if (startX === null) return;
    const deltaX = e.clientX - startX;
    if (deltaX > SWIPE_THRESHOLD) {
      showPrev();
    } else if (deltaX < -SWIPE_THRESHOLD) {
      showNext();
    } else if (e.target === e.currentTarget) {
      // plain tap on the backdrop itself (not a swipe, not on the image/buttons) closes the lightbox
      close();
    }
    pointerStartXRef.current = null;
  }

  const active = activeIndex !== null ? PHOTOS[activeIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-5">
        {visiblePhotos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => openLightbox(index)}
            disabled={lightboxLocked}
            className="relative overflow-hidden bg-[#f0f0e0]"
            style={{ aspectRatio: photo.gridRatio }}
          >
            <Image
              src={photo.src}
              alt={`웨딩 스냅 사진 ${index + 1}`}
              fill
              sizes="170px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {hasMore && (
        <div className="mt-[46px] flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded-[30px] border-[0.5px] bg-white px-[13px] py-[6px] font-batang text-[12px] leading-[22px] text-black"
          >
            더보기 
          </button>
        </div>
      )}

      {active && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-white/90"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="닫기"
            className="absolute top-4 right-4 text-2xl text-white"
          >
            ✕
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="이전 사진"
            className="absolute left-2 px-2 text-3xl text-black z-[1000]"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="다음 사진"
            className="absolute right-2 px-2 text-3xl text-black z-[1000]"
          >
            ›
          </button>

          <div onClick={(e) => e.stopPropagation()} className="relative">
            <Image
              key={active.src}
              src={active.src}
              alt={`웨딩 스냅 사진 ${activeIndex! + 1}`}
              width={active.width}
              height={active.height}
              sizes="92vw"
              className="h-auto max-h-[80vh] w-auto max-w-[calc(92vw-50px)] object-contain"
            />
          </div>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-batang text-[12px] text-black/80">
            {activeIndex! + 1} / {PHOTOS.length}
          </p>
        </div>
      )}
    </>
  );
}
