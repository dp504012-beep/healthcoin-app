export type User = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
};

export type RegisterInput = {
  email?: unknown;
  password?: unknown;
};

export type LoginInput = {
  email?: unknown;
  password?: unknown;
};

export type PublicUser = {
  id: string;
  email: string;
  createdAt: string;
};
