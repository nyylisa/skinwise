import { z } from "zod";

export const CompatibilityStatusEnum = z.enum(["CONFLICT", "CAUTION", "SAFE", "INSUFFICIENT_DATA"]);
export type CompatibilityStatus = z.infer<typeof CompatibilityStatusEnum>;

export const ScheduleTypeEnum = z.enum([
  "ALTERNATE_DAYS",
  "AM_PM_SPLIT",
  "LAYER_TOGETHER",
  "INERT",
  "UNKNOWN",
]);
export type ScheduleType = z.infer<typeof ScheduleTypeEnum>;

export const ConflictPairSchema = z.object({
  compound1: z.string(),
  compound2: z.string(),
  mechanism: z.string(),
});
export type ConflictPair = z.infer<typeof ConflictPairSchema>;

export const AnalysisResultSchema = z.object({
  status: CompatibilityStatusEnum,
  summaryTitle: z.string(),
  activesProduct1: z.array(z.string()),
  activesProduct2: z.array(z.string()),
  conflictPairs: z.array(ConflictPairSchema),
  biochemicalExplanation: z.string(),
  timingProtocol: z.object({
    scheduleType: ScheduleTypeEnum,
    guidanceText: z.string(),
  }),
});
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

export interface AnalyzeRequestBody {
  product1Name?: string;
  product1Ingredients: string;
  product2Name?: string;
  product2Ingredients: string;
}
