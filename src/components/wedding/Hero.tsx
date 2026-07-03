import Image from "next/image";
import DirectionButton from "./DirectionButton";
import WelcomeGraphic from "./WelcomeGraphic";

const WEDDING_DATE = new Date("2026-09-05T14:00:00+09:00");

function getDDayLabel() {
  const diffMs = WEDDING_DATE.getTime() - Date.now();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `D - ${diffDays}`;
  if (diffDays === 0) return "D - Day";
  return `D + ${Math.abs(diffDays)}`;
}

export default function Hero() {
  return (
    <section id="top" className="relative h-[100vh] max-h-[930px] w-full overflow-hidden">
      <Image
        src="/images/wedding/hero.png"
        alt="김찬혁, 김혜민 웨딩 사진"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="pointer-events-none fixed top-[17px] left-1/2 z-[9999] flex w-full max-w-[420px] -translate-x-1/2 justify-between px-[17px]">
      <span className="rounded-[20px] bg-white/50 px-[10px] py-[5px] font-flamenco text-[16px] text-black backdrop-blur-[32px] drop-shadow-[0px_4px_7px_rgba(0,0,0,0.05)]">
        {getDDayLabel()}
      </span>

      <span className="rounded-[41px] bg-white/50 px-[10px] py-[7px] font-flamenco text-[16px] text-black backdrop-blur-[32px] drop-shadow-[0px_4px_7px_rgba(0,0,0,0.05)]">
        2026.09.05 14:00
      </span>
      </div>
      <div className="absolute inset-x-0 bottom-[80px] flex justify-center">
        <WelcomeGraphic />
      </div>
      <DirectionButton />
    </section>
  );
}
