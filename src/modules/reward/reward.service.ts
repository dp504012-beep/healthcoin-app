import * as activityRepository from "../activity/activity.repository";
import { stepToPointsRatio, validationThresholds } from "./rules";
import type { RewardActivity, RewardItem, UserRewardSummary } from "./reward.types";

function calculatePoints(steps: number): number {
  return Math.floor(steps / stepToPointsRatio.steps) * stepToPointsRatio.points;
}

function isValidActivity(activity: RewardActivity): boolean {
  return activity.steps >= validationThresholds.minSteps;
}

export async function getRewardsByUserId(userId: string): Promise<UserRewardSummary> {
  const activities = await activityRepository.getActivitiesByUserId(userId);

  const rewards: RewardItem[] = activities
    .map((activity): RewardActivity => activity)
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
