export type Activity = {
  activityId: string;
  userId: string;
  steps: number;
  timestamp: string;
};

export type CreateActivityInput = {
  userId?: unknown;
  steps?: unknown;
};
