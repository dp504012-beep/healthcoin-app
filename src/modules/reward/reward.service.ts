import { memoryStore } from "../../storage/memory.store";
import { stepToPointsRatio, validationThresholds } from "./rules";
import type { RewardActivity, RewardItem, UserRewardSummary } from "./reward.types";

function calculatePoints(steps: number): number {
  return Math.floor(steps / stepToPointsRatio.steps) * stepToPointsRatio.points;
}

function isValidActivity(activity: RewardActivity): boolean {
  return activity.steps >= validationThresholds.minSteps;
}

export function getRewardsByUserId(userId: string): UserRewardSummary {
  const activities = memoryStore.activities as RewardActivity[];

  const rewards: RewardItem[] = activities
    .filter((activity) => activity.userId === userId)
    .filter(isValidActivity)
    .map((activity) => ({
      activityId: activity.activityId,
      points: calculatePoints(activity.steps)
    }));

  const totalPoints = rewards.reduce((sum, reward) => sum + reward.points, 0);

  return {
    userId,
    totalPoints,
    rewards
  };
}
