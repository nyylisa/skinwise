import { GoogleGenAI } from "@google/genai";
import { CompatibilityStatus } from "@/types/analysis";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function generateBiochemicalSummary(
  p1Name: string,
  p1Actives: string[],
  p2Name: string,
  p2Actives: string[],
  status: CompatibilityStatus,
  defaultExplanation: string
): Promise<string> {
  if (!ai) {
    return defaultExplanation;
  }

  try {
    const prompt = `
You are a cosmetic chemist writing for the SkinWise compatibility checker.
Write exactly 2 concise, plain-English sentences explaining the skin barrier impact of combining:
Product 1: "${p1Name}" with active ingredients: ${p1Actives.join(", ") || "None"}
Product 2: "${p2Name}" with active ingredients: ${p2Actives.join(", ") || "None"}
Status: ${status}

Constraint: No bullet points, no markdown formatting, exactly 2 plain sentences understandable to a non-scientist.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    const text = response.text?.trim();
    return text || defaultExplanation;
  } catch (error) {
    console.warn("Gemini summarizer fallback to deterministic template:", error);
    return defaultExplanation;
  }
}
