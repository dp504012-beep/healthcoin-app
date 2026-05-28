import { economyConfig } from "../../config/economy.config";

export const stepToPointsRatio = {
  steps: economyConfig.reward.stepsPerUnit,
  points: economyConfig.reward.pointsPerUnit
};

export const validationThresholds = {
  minSteps: economyConfig.reward.minValidSteps
};
