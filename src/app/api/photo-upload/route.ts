type PhotoUploadPayload = {
  uploaderName?: unknown;
  note?: unknown;
  fileName?: unknown;
  mimeType?: unknown;
  imageBase64?: unknown;
};

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let payload: PhotoUploadPayload;

  try {
    payload = (await request.json()) as PhotoUploadPayload;
  } catch {
    return Response.json({ message: "잘못된 요청입니다." }, { status: 400 });
  }

  const uploaderName = asString(payload.uploaderName);
  const note = asString(payload.note);
  const fileName = asString(payload.fileName) || "wedding-photo.jpg";
  const mimeType = asString(payload.mimeType);
  const imageBase64 = asString(payload.imageBase64);
  const estimatedBytes = Math.round((imageBase64.length * 3) / 4);

  if (!mimeType.startsWith("image/") || !imageBase64) {
    return Response.json({ message: "업로드할 사진을 선택해 주세요." }, { status: 400 });
  }

  if (estimatedBytes > MAX_UPLOAD_BYTES) {
    return Response.json({ message: "사진 용량이 너무 큽니다. 다른 사진을 선택해 주세요." }, { status: 413 });
  }

  const webhookUrl = process.env.GOOGLE_DRIVE_UPLOAD_WEBHOOK_URL;

  if (!webhookUrl) {
    return Response.json(
      { message: "Google Drive 업로드 URL이 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  try {
    const driveResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uploadedAt: new Date().toISOString(),
        uploaderName,
        note,
        fileName,
        mimeType,
        imageBase64,
      }),
    });
    const responseText = await driveResponse.text();
    const responsePreview = responseText.trim().slice(0, 500);

    if (!driveResponse.ok || responsePreview.startsWith("<!DOCTYPE")) {
      throw new Error(`Google Drive responded with ${driveResponse.status}: ${responsePreview}`);
    }

    try {
      const driveResult = JSON.parse(responseText) as {
        ok?: unknown;
        error?: unknown;
        fileId?: unknown;
        url?: unknown;
      };
      if (driveResult.ok !== true) {
        throw new Error(String(driveResult.error ?? "Google Drive response was not ok"));
      }
      if (typeof driveResult.fileId !== "string" || !driveResult.fileId) {
        throw new Error("Google Drive upload script did not return a fileId");
      }

      return Response.json({
        message: "사진이 업로드되었습니다. 감사합니다.",
        fileId: driveResult.fileId,
        url: typeof driveResult.url === "string" ? driveResult.url : undefined,
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Invalid Google Drive response");
    }
  } catch (error) {
    console.error("Guest photo Google Drive upload failed", error);
    return Response.json(
      {
        message:
          error instanceof Error && error.message.includes("403")
            ? "Google Drive 웹앱 접근 권한을 확인해 주세요."
            : error instanceof Error && error.message.includes("fileId")
              ? "Google Drive 업로드 스크립트가 반영되지 않았습니다. Apps Script를 새 버전으로 배포해 주세요."
              : error instanceof Error && error.message.includes("auth/drive")
                ? "Google Drive 파일 생성 권한 승인이 필요합니다. Apps Script에서 Drive 권한을 승인해 주세요."
              : error instanceof Error && error.message.includes("<!DOCTYPE")
                ? "Google Apps Script 실행 중 오류가 발생했습니다. Drive 폴더 ID와 실행 권한을 확인해 주세요."
            : "사진 업로드 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      },
      { status: 502 },
    );
  }
}
