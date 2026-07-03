import Image from "next/image";
import AccountList from "@/components/wedding/AccountList";
import Calendar from "@/components/wedding/Calendar";
import Gallery from "@/components/wedding/Gallery";
import Hero from "@/components/wedding/Hero";
import PhotoUpload from "@/components/wedding/PhotoUpload";
import RsvpForm from "@/components/wedding/RsvpForm";

export const revalidate = 3600;

const VENUE_NAME = "잠실 더컨벤션 아모르홀";
const KAKAO_MAP_URL = `https://place.map.kakao.com/17651361`;
const NAVER_MAP_URL = `https://naver.me/GCvw1VOd`;

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-[420px] overflow-x-hidden bg-white">
      <Hero />

      {/* 신랑 신부 소개 & 인사말 */}
      <section className="bg-white px-[5px] pt-16 pb-20 text-center font-batang text-black">
        <p className="text-[18px] leading-[31px]">
          신 랑  김찬혁
          <br />
          김영종 · 박영옥의 장남
        </p>
        <p className="mt-[31px] text-[18px] leading-[31px]">
          신 부  김혜민
          <br />
          김일환 · 신은경의 장녀
        </p>
        <p className="mt-12 text-[14px] leading-[28px]">
          서로 다른 두 가정에서 사랑받으며 자라온 저희 두 사람이
          <br />
          이제 하나의 가정을 이루고자 합니다.
        </p>
        <p className="mt-[28px] text-[14px] leading-[28px]">
          소중한 분들을 모시고
          <br />
          새로운 시작의 순간을 함께 나누고 싶습니다.
          <br />
          귀한 걸음으로 축복해 주신 마음 오래도록 간직하며,
          <br />
          서로 아끼고 사랑하며 행복하게 살아가겠습니다.
        </p>
        <p className="mt-[28px] text-[14px] leading-[28px]">
          부디 함께하시어 축복해 주시면 감사하겠습니다.
        </p>
      </section>

      {/* 어릴 적 사진 & 문구 & 날짜 & 달력 */}
      <section className="bg-[#ffffeb] px-[20px] pt-9 pb-[90px] pt-[90px] text-center">
        <div className="relative mx-auto h-[105px] w-[340px] overflow-hidden">
          <Image
            src="/images/wedding/baby-photos.png"
            alt="어릴 적 신랑 신부 사진"
            fill
            sizes="340px"
            className="object-cover"
          />
        </div>

        <p className="mt-[100px] font-flamenco text-[40px] leading-[48px] text-black">
          We love each other!
          <br />
          Such a miracle!
        </p>

        <p className="mt-[30px] font-flamenco text-[20px] text-black">
          2026.09.05. sat 14:00
        </p>
        <p className="mt-[0px] font-batang text-[14px] leading-[28px] text-black">
          2026년 9월 5일 토요일
        </p>

        <div className="mt-[54px]">
          <Calendar />
        </div>
      </section>

      {/* 오시는 길 & RSVP & 하객 사진관 */}
      <section id="location" className="bg-[#d9ead0] px-5 pt-[60px] pb-[60px] text-center">
        <p className="font-batang text-[27px] leading-[28px] text-black mb-[25px]">{VENUE_NAME}</p>
        <p className="mt-2 font-batang text-[14px] leading-[28px] text-black">
          서울특별시 송파구 올림픽로 319 잠실교통회관 3층
          <br />
          02-418-5000
        </p>

        <div className="relative mx-auto mt-[40px] h-[313px] w-[100%] overflow-hidden rounded-[10px] bg-[#ffffeb]">
          <Image
            src="/images/wedding/map.png"
            alt="예식장 약도"
            fill
            className="object-cover mix-blend-multiply"
          />
        </div>

        <div className="mt-[5px] flex justify-center gap-[5px]">
          <a
            href={KAKAO_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-[10px] bg-[#ffffeb] p-[10px] font-batang text-[14px] leading-[28px] text-black"
          >
            카카오 지도 열기
          </a>
          <a
            href={NAVER_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-[10px] bg-[#ffffeb] p-[10px] font-batang text-[14px] leading-[28px] text-black"
          >
            네이버 지도 열기
          </a>
        </div>

        <p className="mt-[28px] font-batang text-[12px] leading-[23px] text-black">
          예식 당일 건물 내 주차장 이용 가능
          <br />
          주차권은 예식장 접수처에서 등록 후 무료 이용
          <br />※ 주말 주차장 혼잡이 예상되오니 가급적 대중교통
          <br />
          이용을 권장드립니다.
        </p>

        <div className="mx-auto mt-[114px] w-[100%] rounded-[15px] bg-[#ffffeb] px-7 py-8">
          <p className="font-fragment text-[20px] leading-[28px] text-black">RSVP</p>
          <p className="mx-auto mt-4 max-w-[295px] font-batang text-[14px] leading-[28px] text-black">
            원활한 예식 준비를 위해 7월 말 ~ 8월 초까지 참석 인원을 회신해 주시면 감사하겠습니다.
          </p>
          <RsvpForm />
        </div>

        <div className="mx-auto mt-6 w-[100%] rounded-[15px] bg-[#ffffeb] px-7 py-8">
          <p className="font-batang text-[20px] leading-[28px] text-black">하객 사진관</p>
          <p className="mx-auto mt-4 max-w-[295px] font-batang text-[14px] leading-[28px] text-black">
            결혼식의 행복한 순간을 담아주세요.
            <br />
            예식 당일, 아래 버튼을 통해
            <br />
            사진을 올려주세요.
          </p>
          <PhotoUpload />
          <p className="mt-4 font-batang text-[12px] leading-[20px] text-black">
            2026-09-05 14:00부터 업로드 가능합니다.
          </p>
        </div>
      </section>

      {/* 하객 사진관 갤러리 */}
      <section className="bg-[#ffffeb] px-5 pt-10 pb-[35px]">
        <Gallery />
      </section>

      {/* 마음 전하실 곳 */}
      <section className="bg-[#d9ead0] px-4 pt-[90px] pb-[130px] text-center">
        <p className="font-batang text-[20px] leading-[28px] text-black">마음 전하실 곳</p>
        <p className="mx-auto mt-[23px] max-w-[358px] font-batang text-[14px] leading-[28px] text-black">
          참석이 어려우신 분들을 위해 계좌를 함께 안내드립니다.
          <br />
          버튼을 클릭하면 계좌번호가 복사됩니다.
        </p>

        <div className="mt-[61px]">
          <AccountList />
        </div>
      </section>
    </div>
  );
}
