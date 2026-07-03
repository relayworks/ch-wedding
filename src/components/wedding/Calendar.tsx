const WEEKS: { label: string; faded?: boolean; highlight?: boolean }[][] = [
  [
    { label: "30", faded: true },
    { label: "31", faded: true },
    { label: "1" },
    { label: "2" },
    { label: "3" },
    { label: "4" },
    { label: "5", highlight: true },
  ],
  [
    { label: "6" },
    { label: "7" },
    { label: "8" },
    { label: "9" },
    { label: "10" },
    { label: "11" },
    { label: "12" },
  ],
  [
    { label: "13" },
    { label: "14" },
    { label: "15" },
    { label: "16" },
    { label: "17" },
    { label: "18" },
    { label: "19" },
  ],
  [
    { label: "20" },
    { label: "21" },
    { label: "22" },
    { label: "23" },
    { label: "24" },
    { label: "25" },
    { label: "26" },
  ],
  [
    { label: "27" },
    { label: "28" },
    { label: "29" },
    { label: "30" },
    { label: "1", faded: true },
    { label: "2", faded: true },
    { label: "3", faded: true },
  ],
];

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function Calendar() {
  return (
    <div className="mx-auto w-[317px] font-flamenco text-black">
      <div className="mb-4 grid grid-cols-7 text-center text-[13px] opacity-50">
        {DAY_LABELS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-[24px] text-center text-[14px] leading-[28px]">
        {WEEKS.flat().map((day, i) => (
          <div key={i} className="relative flex items-center justify-center">
            {day.highlight && (
              <span className="absolute size-[32px] rounded-full bg-[#d9ead0]" />
            )}
            <span
              className={`relative ${day.faded ? "opacity-30" : ""} ${
                day.highlight ? "font-bold" : ""
              }`}
            >
              {day.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
