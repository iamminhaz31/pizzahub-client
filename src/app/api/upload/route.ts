import { NextResponse } from "next/server";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "Image upload is not configured." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Please choose an image file." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Only image files are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { message: "Image must be smaller than 5 MB." },
        { status: 400 }
      );
    }

    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

    const body = new FormData();
    body.append("image", base64);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      { method: "POST", body }
    );

    const result = await response.json();

    if (!response.ok || !result?.success) {
      return NextResponse.json(
        { message: "Image upload failed. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      url: result.data.display_url ?? result.data.url,
    });
  } catch {
    return NextResponse.json(
      { message: "Image upload failed. Please try again." },
      { status: 500 }
    );
  }
}