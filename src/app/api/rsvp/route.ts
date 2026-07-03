type RsvpPayload = {
  name?: unknown;
  hasCompanion?: unknown;
  companionCount?: unknown;
  busRoute?: unknown;
  busPassengerCount?: unknown;
  busRepresentativeName?: unknown;
  busPhone?: unknown;
};

const BUS_ROUTE_LABELS: Record<string, string> = {
  none: "이용 안 함",
  daegu: "대구 왕복",
  gwangju: "광주 왕복",
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export async function POST(request: Request) {
  let payload: RsvpPayload;

  try {
    payload = (await request.json()) as RsvpPayload;
  } catch {
    return Response.json({ message: "잘못된 요청입니다." }, { status: 400 });
  }

  const name = asString(payload.name);
  const hasCompanion = Boolean(payload.hasCompanion);
  const companionCount = hasCompanion ? asNumber(payload.companionCount) : 0;
  const busRoute = asString(payload.busRoute) || "none";
  const busPassengerCount = busRoute === "none" ? 0 : asNumber(payload.busPassengerCount);
  const busRepresentativeName = busRoute === "none" ? "" : asString(payload.busRepresentativeName);
  const busPhone = busRoute === "none" ? "" : asString(payload.busPhone);

  if (!name) {
    return Response.json({ message: "이름을 입력해 주세요." }, { status: 400 });
  }

  if (hasCompanion && companionCount < 1) {
    return Response.json({ message: "동반인 수를 입력해 주세요." }, { status: 400 });
  }

  if (!Object.hasOwn(BUS_ROUTE_LABELS, busRoute)) {
    return Response.json({ message: "전세버스 이용 여부를 확인해 주세요." }, { status: 400 });
  }

  if (busRoute !== "none" && (!busPassengerCount || !busRepresentativeName || !busPhone)) {
    return Response.json({ message: "전세버스 이용 정보를 모두 입력해 주세요." }, { status: 400 });
  }

  const submittedAt = new Date().toISOString();
  const normalizedPayload = {
    submittedAt,
    name,
    hasCompanion: hasCompanion ? "있음" : "없음",
    companionCount,
    busRoute: BUS_ROUTE_LABELS[busRoute],
    busPassengerCount,
    busRepresentativeName,
    busPhone,
  };

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    return Response.json(
      { message: "Google Sheets 연동 URL이 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  try {
    const sheetsResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizedPayload),
    });
    const responseText = await sheetsResponse.text();
    const responsePreview = responseText.trim().slice(0, 200);

    if (!sheetsResponse.ok || responsePreview.startsWith("<!DOCTYPE")) {
      throw new Error(
        `Google Sheets responded with ${sheetsResponse.status}: ${responsePreview}`,
      );
    }

    try {
      const sheetsResult = JSON.parse(responseText) as { ok?: unknown; error?: unknown };
      if (sheetsResult.ok !== true) {
        throw new Error(String(sheetsResult.error ?? "Google Sheets response was not ok"));
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Invalid Google Sheets response");
    }

    return Response.json({ message: "회신이 저장되었습니다. 감사합니다." });
  } catch (error) {
    console.error("RSVP Google Sheets sync failed", error);
    return Response.json(
      {
        message:
          error instanceof Error && error.message.includes("403")
            ? "Google Sheets 웹앱 접근 권한을 확인해 주세요."
            : "회신 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      },
      { status: 502 },
    );
  }
}
