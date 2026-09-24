import { NextResponse } from "next/server";
import { submitToIndexNow } from "../../../lib/seo/indexnow";

export async function POST(request) {
  try {
    const body = await request.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: "Invalid payload: 'urls' must be an array of paths or URLs" },
        { status: 400 }
      );
    }

    const result = await submitToIndexNow(urls);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
