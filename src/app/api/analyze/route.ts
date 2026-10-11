import { NextRequest, NextResponse } from "next/server";
import { analyzeCompatibility } from "@/src/lib/engine";
import { AnalyzeRequest } from "@/src/types/analysis";

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();

    if (!body.product1Ingredients?.trim() || !body.product2Ingredients?.trim()) {
      return NextResponse.json(
        { error: "Both Product 1 and Product 2 ingredient lists are required." },
        { status: 400 }
      );
    }

    const result = await analyzeCompatibility({
      product1Ingredients: body.product1Ingredients,
      product2Ingredients: body.product2Ingredients,
      product1Name: body.product1Name || "Product 1",
      product2Name: body.product2Name || "Product 2"
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("API /api/analyze Error:", error);
    const message = error instanceof Error ? error.message : "Internal analysis error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
