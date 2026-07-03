This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## RSVP Google Sheets

RSVP submissions are sent to `/api/rsvp`. Set `GOOGLE_SHEETS_WEBHOOK_URL` to a Google Apps Script web app URL to append rows to a Google Sheet.

Create a Google Sheet with this header row:

```text
제출시각,이름,동반인여부,동반인수,전세버스,버스이용인원,대표탑승자,전화번호
```

Use this Apps Script and deploy it as a web app with access set to anyone with the link:

```js
const PHOTO_FOLDER_ID = "GOOGLE_DRIVE_FOLDER_ID";

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  if (data.imageBase64) {
    return uploadGuestPhoto(data);
  }

  return appendRsvp(data);
}

function appendRsvp(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  sheet.appendRow([
    data.submittedAt,
    data.name,
    data.hasCompanion,
    data.companionCount,
    data.busRoute,
    data.busPassengerCount,
    data.busRepresentativeName,
    data.busPhone,
  ]);

  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function uploadGuestPhoto(data) {
  const folder = DriveApp.getFolderById(PHOTO_FOLDER_ID);
  const bytes = Utilities.base64Decode(data.imageBase64);
  const blob = Utilities.newBlob(bytes, data.mimeType, data.fileName);
  const timestamp = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyyMMdd-HHmmss");
  const uploader = data.uploaderName || "guest";
  const file = folder.createFile(blob).setName(`${timestamp}-${uploader}-${data.fileName}`);

  if (data.note) {
    file.setDescription(data.note);
  }

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, fileId: file.getId(), url: file.getUrl() }),
  ).setMimeType(ContentService.MimeType.JSON);
}
```

## Guest Photo Google Drive

Guest photo uploads are sent to `/api/photo-upload`. Set `GOOGLE_DRIVE_UPLOAD_WEBHOOK_URL` to a Google Apps Script web app URL. It can be the same URL as `GOOGLE_SHEETS_WEBHOOK_URL` if you use the combined Apps Script above.

Create a Google Drive folder, copy the folder ID from its URL, and replace `GOOGLE_DRIVE_FOLDER_ID` in the script.

The upload button opens the native iOS/Android photo picker directly with multiple selection enabled. Selected photos are resized in the browser and uploaded one by one without asking for a name or message.
