import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const collection = await getCollection();

    const pipeline = [
      { $unwind: "$lead_managers" },
      { $group: { _id: "$lead_managers.manager_name" } },
      { $match: { _id: { $ne: null, $ne: "" } } },
      { $sort: { _id: 1 } },
    ];

    const data = await collection.aggregate(pipeline).toArray();
    return NextResponse.json(data.map((d) => d._id));
  } catch (err) {
    console.error("[/api/filters/lead-managers]", err);
    return NextResponse.json({ error: "Failed to fetch lead managers" }, { status: 500 });
  }
}
