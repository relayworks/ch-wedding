"use client";

import { FormEvent, useEffect, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

const BUS_OPTIONS = [
  { value: "none", label: "이용 안 함" },
  { value: "daegu", label: "대구 왕복" },
  { value: "gwangju", label: "광주 왕복" },
] as const;

export default function RsvpForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompanion, setHasCompanion] = useState(false);
  const [busRoute, setBusRoute] = useState<(typeof BUS_OPTIONS)[number]["value"]>("none");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitState("submitting");
    setMessage("");

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      hasCompanion,
      companionCount: hasCompanion ? Number(formData.get("companionCount") || 0) : 0,
      busRoute,
      busPassengerCount: busRoute === "none" ? 0 : Number(formData.get("busPassengerCount") || 0),
      busRepresentativeName:
        busRoute === "none" ? "" : String(formData.get("busRepresentativeName") ?? "").trim(),
      busPhone: busRoute === "none" ? "" : String(formData.get("busPhone") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responseText = await response.text();
      let result: { message?: string } = {};

      try {
        result = responseText ? (JSON.parse(responseText) as { message?: string }) : {};
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(result.message ?? "회신 저장에 실패했습니다.");
      }

      setSubmitState("success");
      setMessage(result.message ?? "회신이 저장되었습니다. 감사합니다.");
      form.reset();
      setHasCompanion(false);
      setBusRoute("none");
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setSubmitState("idle");
          setMessage("");
        }}
        className="mt-6 rounded-[5px] border-[0.5px] border-black bg-[#ffffeb] p-[10px] font-batang text-[14px] leading-[28px] text-black"
      >
        참석 회신하기
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[1000000] flex items-end justify-center bg-white/90 px-4 py-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rsvp-title"
            className="animate-rsvp-sheet-up max-h-[92vh] w-full max-w-[390px] overflow-y-auto rounded-[8px] bg-[#ffffeb] px-5 py-6 text-left font-batang text-black shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p id="rsvp-title" className="text-[21px] leading-[28px] font-fragment">
                  RSVP
                </p>
                <p className="mt-2 text-[12px] leading-[20px] text-black/70">
                  참석 인원과 전세버스 이용 정보를 알려주세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="닫기"
                className="h-9 w-9 shrink-0 rounded-full text-[20px] leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
              <label className="flex flex-row gap-2 text-[13px] items-center border-b-[1px] py-[5px]">
                <span className="w-[100px] block flex-shrink-0">이름</span>
                <input
                  name="name"
                  required
                  autoComplete="name"
                  className="rounded-[8px] bg-white px-3 py-3 text-[13px] outline-none focus:border-black w-full"
                  placeholder="성함을 입력해 주세요"
                />
              </label>

              <div className="border-b-[1px] py-4">
                <label className="flex items-center gap-3 text-[13px] py-[5px]">
                 <span className="w-[100px] block"> 동반인 있음</span>
                  <input
                    type="checkbox"
                    checked={hasCompanion}
                    onChange={(event) => setHasCompanion(event.target.checked)}
                    className="h-5 w-5 accent-[#42461E] rounded-[20px]"
                  />
                </label>
                {hasCompanion ? (
                  <label className="mt-4 flex flex-col gap-2 text-[13px]">
                    <span className="w-[100px] block">동반인 수</span>
                    <input
                      name="companionCount"
                      type="number"
                      min="1"
                      max="10"
                      required={hasCompanion}
                      className="rounded-[8px] border border-black/20 bg-[#ffffeb] px-3 py-3 text-[13px] outline-none focus:border-black"
                      placeholder="본인 제외 인원"
                    />
                  </label>
                ) : null}
              </div>

              <div className=" py-4">
                <p className="text-[13px]">전세버스 이용 여부</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {BUS_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className={busRoute === option.value ? "flex min-h-12 items-center justify-center rounded-[8px] border border-black px-2 text-center text-[12px] leading-[18px] text-black" : "flex min-h-12 items-center justify-center rounded-[8px] border border-black/20 bg-white px-2 text-center text-[12px] leading-[18px]"}
                    >
                      <input
                        type="radio"
                        name="busRoute"
                        value={option.value}
                        checked={busRoute === option.value}
                        onChange={() => setBusRoute(option.value)}
                        className={busRoute === option.value ? "sr-only" : "sr-only"}
                      />
                      <span className={busRoute === option.value ? "text-black" : ""}>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>

                {busRoute !== "none" ? (
                  <div className="mt-4 flex flex-col gap-4">
                    <label className="flex flex-row gap-2 text-[13px] items-center border-b-[1px] py-[5px]">
                      <span className="w-[100px] block flex-shrink-0">이용 인원</span>
                      
                      <input
                        name="busPassengerCount"
                        type="number"
                        min="1"
                        max="20"
                        required
                  className="rounded-[8px] bg-white px-3 py-3 text-[13px] outline-none focus:border-black w-full"
                        placeholder="본인 포함 인원"
                      />
                    </label>
                    <label className="flex flex-row gap-2 text-[13px] items-center border-b-[1px] py-[5px]">
                     <span className="w-[100px] block flex-shrink-0"> 대표 탑승자 이름</span>
                      <input
                        name="busRepresentativeName"
                        required
                  className="rounded-[8px] bg-white px-3 py-3 text-[13px] outline-none focus:border-black w-full"
                        placeholder="성함을 입력해 주세요"
                      />
                    </label>
                    <label className="flex flex-row gap-2 text-[13px] items-center border-b-[1px] py-[5px]">
                     <span className="w-[100px] block flex-shrink-0"> 전화번호</span>
                      <input
                        name="busPhone"
                        type="tel"
                        required
                        autoComplete="tel"
                  className="rounded-[8px] bg-white px-3 py-3 text-[13px] outline-none focus:border-black w-full"
                        placeholder="010-0000-0000"
                      />
                    </label>
                  </div>
                ) : null}
              </div>

              {message ? (
                <p
                  className={`rounded-[8px] px-3 py-3 text-center text-[13px] leading-[20px] ${
                    submitState === "error" ? "bg-red-50 text-red-700" : "bg-white text-black"
                  }`}
                >
                  {message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitState === "submitting"}
                className="rounded-[8px] border border-black px-4 py-4 text-center text-[15px] text-black disabled:opacity-60"
              >
                {submitState === "submitting" ? "저장 중..." : "회신 보내기"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
