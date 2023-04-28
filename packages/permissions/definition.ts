const operations = ["create", "read", "update", "delete"] as const;
const protectedResources = ["grid", "permission", "approval"] as const;

export const PERM: Record<`${ProtectedResources}.${Operation}`, number> =
  Object.fromEntries([
    operations
      .map((operation, i) =>
        protectedResources.map((resource) => [
          `${resource}.${operation}`,
          1 << i,
        ])
      )
      .flat(1),
  ]);

type Operation = typeof operations[number];
type ProtectedResources = typeof protectedResources[number];
export type PermissionType = keyof typeof PERM;
