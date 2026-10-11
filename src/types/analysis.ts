export type Status = 'CONFLICT' | 'CAUTION' | 'SAFE' | 'UNKNOWN' | 'INSUFFICIENT_DATA';

export type Schedule =
  | 'LAYER_TOGETHER'
  | 'AM_PM_SPLIT'
  | 'ALTERNATE_DAYS'
  | 'UNKNOWN';

export interface AnalyzeRequest {
  product1Name?: string;
  product1Ingredients: string;
  product2Name?: string;
  product2Ingredients: string;
}

export interface ConflictPair {
  compound1: string;
  compound2: string;
  mechanism: string;
}

export interface AnalyzeResponse {
  status: Status;
  summaryTitle: string;
  activesProduct1: string[];
  activesProduct2: string[];
  conflictPairs: ConflictPair[];
  biochemicalExplanation: string;
  timingProtocol: {
    scheduleType: Schedule;
    guidanceText: string;
  };
  disclaimer: string;
}

// Aliases for UI and legacy imports
export type CompatibilityStatus = Status | 'INSUFFICIENT_DATA';
export type ScheduleType = Schedule | 'INERT';
export type AnalysisResult = AnalyzeResponse;
export type AnalyzeRequestBody = AnalyzeRequest;
