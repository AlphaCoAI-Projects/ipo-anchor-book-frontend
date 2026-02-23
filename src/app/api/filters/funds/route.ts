import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const collection = await getCollection();

    const pipeline = [
      { $unwind: "$anchor_investors_data" },
      { $group: { _id: "$anchor_investors_data.anchor_investor_name" } },
      { $match: { _id: { $nin: [null, ""] } } },
      { $sort: { _id: 1 } },
    ];

    const data = await collection.aggregate(pipeline).toArray();
    return NextResponse.json(data.map((d) => d._id));
  } catch (err) {
    console.error("[/api/filters/funds]", err);
    return NextResponse.json({ error: "Failed to fetch funds" }, { status: 500 });
  }
}
