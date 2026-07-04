"use client";

import { ChangeEvent, useEffect, useState } from "react";

type SubmitState = "idle" | "preparing" | "submitting" | "success" | "error";

type PreparedPhoto = {
  fileName: string;
  mimeType: string;
  base64: string;
};

const MAX_IMAGE_SIZE = 1600;
const JPEG_QUALITY = 0.82;
const MAX_PHOTO_COUNT = 10;
const PHOTO_UPLOAD_OPEN_AT = new Date("2026-09-04T15:00:00.000Z").getTime(); // 2026-09-05 00:00 KST

async function preparePhoto(file: File): Promise<PreparedPhoto> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 불러오지 못했습니다."));
    };
    img.src = url;
  });

  const scale = Math.min(1, MAX_IMAGE_SIZE / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("이미지를 처리하지 못했습니다.");
  }

  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  const safeName = file.name.replace(/\.[^.]+$/, "") || "wedding-photo";

  return {
    fileName: `${safeName}.jpg`,
    mimeType: "image/jpeg",
    base64: dataUrl.split(",")[1] ?? "",
  };
}

async function parseResponse(response: Response) {
  const responseText = await response.text();

  try {
    return responseText ? (JSON.parse(responseText) as { message?: string }) : {};
  } catch {
    return {};
  }
}

export default function PhotoUpload() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const isBusy = submitState === "preparing" || submitState === "submitting";
  const isDisabled = !isUploadOpen || isBusy;

  useEffect(() => {
    function updateUploadOpen() {
      setIsUploadOpen(Date.now() >= PHOTO_UPLOAD_OPEN_AT);
    }

    updateUploadOpen();
    const timer = window.setInterval(updateUploadOpen, 60 * 1000);

    return () => window.clearInterval(timer);
  }, []);

  async function uploadPhoto(photo: PreparedPhoto) {
    const response = await fetch("/api/photo-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: photo.fileName,
        mimeType: photo.mimeType,
        imageBase64: photo.base64,
      }),
    });
    const result = await parseResponse(response);

    if (!response.ok) {
      throw new Error(result.message ?? "사진 업로드에 실패했습니다.");
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    setMessage("");

    if (!files.length) {
      setSubmitState("idle");
      return;
    }

    if (files.some((file) => !file.type.startsWith("image/"))) {
      setSubmitState("error");
      setMessage("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    try {
      const selectedFiles = files.slice(0, MAX_PHOTO_COUNT);
      setSubmitState("preparing");
      setMessage("사진을 준비하고 있습니다...");

      const photos = await Promise.all(selectedFiles.map((file) => preparePhoto(file)));

      setSubmitState("submitting");
      for (const [index, photo] of photos.entries()) {
        setMessage(`${index + 1}/${photos.length}장 업로드 중...`);
        await uploadPhoto(photo);
      }

      setSubmitState("success");
      setMessage(`${photos.length}장의 사진이 업로드되었습니다. 감사합니다.`);
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <div className="mt-6 flex flex-col items-center">
      <label
        aria-disabled={isDisabled}
        className={`rounded-[5px] border-[0.5px] border-black bg-[#ffffeb] p-[10px] font-batang text-[14px] leading-[28px] text-black ${
          isDisabled ? `pointer-events-none ${isBusy ? "opacity-60" : "opacity-30"}` : ""
        }`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={isDisabled}
          className="sr-only"
          onChange={handleFileChange}
        />
        {isBusy ? "업로드 중..." : "사진 업로드"}
      </label>

      {message ? (
        <p
          className={`mt-3 max-w-[295px] rounded-[8px] px-3 py-3 text-center font-batang text-[12px] leading-[20px] ${
            submitState === "error" ? "bg-red-50 text-red-700" : "bg-white text-black"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
