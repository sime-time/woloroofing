import type { EstimateQuizAnswers } from "$lib/server/db/schema";
import {
  buildCustomerMessage,
  buildOwnerSummary,
} from "$lib/server/roof-estimate/format-result";
import {
  getBaseRange,
  getComplexityMultiplier,
  getConditionMultiplier,
  getRoofTypeMultiplier,
  getStoryMultiplier,
} from "$lib/server/roof-estimate/multipliers";
import {
  formatEstimateRange,
  getResultType,
  roundDownToNearest500,
  roundUpToNearest500,
} from "./format-result";

export type ResultType =
  | "roof_replacement"
  | "storm_damage"
  | "possible_repair"
  | "exterior_only"
  | "general";

export type EstimateResult = {
  estimateLow: number;
  estimateHigh: number;
  resultType: ResultType;
  customerMessage: string;
  ownerSummary: string;
};

export function calculateRoofEstimate(
  answers: EstimateQuizAnswers,
  lead: {
    name?: string;
    phone?: string;
    email?: string;
    preferredContact: "sms" | "email";
    smsConsent?: boolean;
  },
): EstimateResult {
  const [baseLow, baseHigh] = getBaseRange(answers.homeSize);
  const [roofLow, roofHigh] = getRoofTypeMultiplier(answers.roofType);
  const [storyLow, storyHigh] = getStoryMultiplier(answers.stories);
  const [complexityLow, complexityHigh] = getComplexityMultiplier(
    answers.roofComplexity,
  );
  const [conditionLow, conditionHigh] = getConditionMultiplier(
    answers.roofCondition,
  );

  const rawLow = baseLow * roofLow * storyLow * complexityLow * conditionLow;
  const rawHigh =
    baseHigh * roofHigh * storyHigh * complexityHigh * conditionHigh;

  const estimateLow = roundDownToNearest500(rawLow);
  const estimateHigh = roundUpToNearest500(rawHigh);

  const resultType = getResultType(answers);
  const estimateRange = formatEstimateRange(estimateLow, estimateHigh);

  return {
    estimateLow,
    estimateHigh,
    resultType,
    customerMessage: buildCustomerMessage(
      lead.name,
      estimateRange,
      resultType,
      lead.preferredContact,
    ),
    ownerSummary: buildOwnerSummary(answers, lead, estimateRange),
  };
}
