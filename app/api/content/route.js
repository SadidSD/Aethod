import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ADMIN_PASSCODE = "systems2026";

// Helper to get absolute path to content folder
function getFilePath(type) {
  return path.join(process.cwd(), "content", `${type}.json`);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "research", "works", or "blog"

    if (!type || !["research", "works", "blog"].includes(type)) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const filePath = getFilePath(type);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([], { status: 200 });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, passcode, data } = body;

    // Verify Passcode
    if (passcode !== ADMIN_PASSCODE) {
      return NextResponse.json({ error: "Unauthorized passcode" }, { status: 401 });
    }

    if (!type || !["research", "works", "blog"].includes(type)) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid data payload" }, { status: 400 });
    }

    const filePath = getFilePath(type);
    let currentData = [];

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      currentData = JSON.parse(fileContent);
    }

    // Auto-generate ID if not provided
    const newEntry = {
      id: data.id || `${type}-${Date.now()}`,
      ...data
    };

    // Add to start (newest first) or append
    currentData.unshift(newEntry);

    // Save back to disk
    fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), "utf-8");

    return NextResponse.json({ success: true, entry: newEntry }, { status: 200 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
