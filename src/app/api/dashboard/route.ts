import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { DashboardQuery } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body: DashboardQuery = await req.json();
    const collection = await getCollection();

    // ── Build query — mirrors the FastAPI implementation exactly ────────────
    const query: Record<string, unknown> = {};

    if (body.leadManagers?.length)
      query["lead_managers.manager_name"] = { $in: body.leadManagers };

    if (body.companies?.length)
      query["company_name"] = { $in: body.companies };

    if (body.funds?.length)
      query["anchor_investors_data.anchor_investor_name"] = { $in: body.funds };

    if (body.years?.length)
      query["year"] = { $in: body.years };

    if (body.ipoType?.length)
      query["ipo_type"] = { $in: body.ipoType };

    const results = await collection.find(query).limit(1000).toArray();

    // Serialize ObjectId → string
    const serialized = results.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    return NextResponse.json(serialized);
  } catch (err) {
    console.error("[/api/dashboard]", err);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}
