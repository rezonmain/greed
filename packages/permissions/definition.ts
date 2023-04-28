const operations = ["create", "read", "update", "delete"] as const;
const protectedResources = ["grid", "permission", "approval"] as const;
type Operation = typeof operations[number];
type ProtectedResources = typeof protectedResources[number];

export const PERM: Readonly<
  Record<`${ProtectedResources}.${Operation}`, number>
> = Object.fromEntries([
  operations
    .map((operation, i) =>
      protectedResources.map((resource) => [`${resource}.${operation}`, 1 << i])
    )
    .flat(1),
]);

export const RP: Readonly<Record<Roles, PermissionType[]>> = {
  owner: Object.keys(PERM) as PermissionType[],
  moderator: [
    "grid.read",
    "grid.update",
    "permission.read",
    "approval.read",
    "approval.update",
    "approval.create",
    "approval.delete",
  ],
  user: ["grid.read", "approval.read", "approval.create"],
};

export type PermissionType = keyof typeof PERM;
export type Roles = "owner" | "moderator" | "user";
