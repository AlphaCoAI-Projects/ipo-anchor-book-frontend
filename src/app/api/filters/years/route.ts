import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const collection = await getCollection();
    const data = await collection.distinct("year");
    const years = data
      .filter((y) => typeof y === "number" && !isNaN(y))
      .sort((a, b) => b - a);
    return NextResponse.json(years);
  } catch (err) {
    console.error("[/api/filters/years]", err);
    return NextResponse.json({ error: "Failed to fetch years" }, { status: 500 });
  }
}
