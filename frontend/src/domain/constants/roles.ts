export const USER_ROLES = ["admin", "client", "mechanic", "seller"] as const;

export type UserRole = (typeof USER_ROLES)[number];
