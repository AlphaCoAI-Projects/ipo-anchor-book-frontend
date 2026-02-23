import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const collection = await getCollection();
    const data = await collection.distinct("company_name");
    return NextResponse.json(data.filter(Boolean).sort());
  } catch (err) {
    console.error("[/api/filters/companies]", err);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}
