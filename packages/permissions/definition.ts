const operations = ["create", "read", "update", "delete"] as const;
const protectedResources = ["grid", "permission", "approval"] as const;
type Operation = typeof operations[number];
type ProtectedResources = typeof protectedResources[number];

type PermissionName = `${ProtectedResources}.${Operation}`;

export const PERM = Object.fromEntries(
  protectedResources
    .map((pr) => operations.map((op) => `${pr}.${op}`))
    .flat(1)
    .map((name, i) => [name, 1 << i])
) as Readonly<Record<PermissionName, number>>;

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
