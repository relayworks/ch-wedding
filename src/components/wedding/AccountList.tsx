"use client";

import { useState } from "react";

type Account = {
  role: string;
  bank: string;
  number: string;
  holder: string;
};

type Group = {
  label: string;
  accounts: Account[];
};

const GROUPS: Group[] = [
  {
    label: "신부측 계좌번호",
    accounts: [
      { role: "신부 계좌번호", bank: "국민", number: "90507052470", holder: "김혜민" },
      { role: "신부측(부) 계좌번호", bank: "농협", number: "356 0569 5393 13", holder: "신은경" },
      { role: "신부측(모) 계좌번호", bank: "대구", number: "002 08 625149", holder: "신은경" },
    ],
  },
  {
    label: "신랑측 계좌번호",
    accounts: [
      { role: "신랑 계좌번호", bank: "국민", number: "79200201170645", holder: "김찬혁" },
      { role: "신랑측(부) 계좌번호", bank: "농협", number: "671-02-398305", holder: "김영종" },
      { role: "신랑측(모) 계좌번호", bank: "우리", number: "651-08-100856", holder: "박영옥" },
    ],
  },
];

export default function AccountList() {
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  async function handleCopy(key: string, bank: string, number: string) {
    try {
      await navigator.clipboard.writeText(`${bank} ${number}`);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 1500);
    } catch {
      // clipboard unavailable, ignore
    }
  }

  return (
    <div className="flex flex-col gap-[10px] font-batang text-black">
      {GROUPS.map((group, groupIndex) => {
        const isOpen = openGroup === groupIndex;
        return (
          <div key={group.label} className="w-full overflow-hidden rounded-[10px] bg-[#ffffeb]">
            <button
              type="button"
              onClick={() => setOpenGroup(isOpen ? null : groupIndex)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between px-[13px] py-[16px] text-left"
            >
              <span className="text-[15px]">{group.label}</span>
              <svg
                viewBox="0 0 14 8"
                className={`h-[8px] w-[14px] shrink-0 transition-transform duration-300 ease-in-out ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                aria-hidden
              >
                <path
                  d="M1 1L7 7L13 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-[8px] px-[13px] pb-[13px]">
                  {group.accounts.map((account) => (
                    <button
                      key={account.role}
                      type="button"
                      onClick={() => handleCopy(account.role, account.bank, account.number)}
                      className="flex w-full items-center justify-between rounded-[8px] bg-white px-[13px] py-[9px] text-left"
                    >
                      <span className="shrink-0 text-[13px]">{account.role}</span>
                      <span className="shrink-0 text-[12px]">
                        {copiedKey === account.role
                          ? "복사되었습니다"
                          : `${account.bank} ${account.number} (${account.holder})`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
