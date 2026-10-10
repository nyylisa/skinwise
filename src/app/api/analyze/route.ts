import { NextRequest, NextResponse } from "next/server";
import { analyzePairwiseCompatibility } from "@/src/lib/engine";
import { AnalyzeRequestBody } from "@/src/types/analysis";

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequestBody = await req.json();

    if (!body.product1Ingredients?.trim() || !body.product2Ingredients?.trim()) {
      return NextResponse.json(
        { error: "Both Product 1 and Product 2 ingredient lists are required." },
        { status: 400 }
      );
    }

    const result = await analyzePairwiseCompatibility(
      body.product1Ingredients,
      body.product2Ingredients,
      body.product1Name || "Product 1",
      body.product2Name || "Product 2"
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("API /api/analyze Error:", error);
    const message = error instanceof Error ? error.message : "Internal analysis error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
