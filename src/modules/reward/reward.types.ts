export type RewardActivity = {
  activityId: string;
  userId: string;
  steps: number;
  timestamp: string;
};

export type RewardItem = {
  activityId: string;
  points: number;
};

export type UserRewardSummary = {
  userId: string;
  totalPoints: number;
  rewards: RewardItem[];
};
