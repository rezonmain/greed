import { type DefinitionOf } from "../types/DefinitionOf";
import { type PermissionsOf } from "../types/PermissionsOf";

export const operations = ["create", "read", "update", "delete"] as const;
export const protectedResources = ["grid", "permission", "cell"] as const;

export type GridPermissionType = PermissionsOf<
  typeof protectedResources,
  typeof operations
>;

export type GridRoles = "grid.owner" | "grid.moderator" | "grid.buyer";

export const gridPermissions = Object.fromEntries(
  protectedResources
    .map((pr) => operations.map((op) => `${pr}.${op}`))
    .flat(1)
    .map((name, i) => [name, 1 << i])
) as DefinitionOf<typeof protectedResources, typeof operations>;

export const gridRolesPermissions: Readonly<
  Record<GridRoles, GridPermissionType[]>
> = {
  "grid.owner": Object.keys(gridPermissions) as GridPermissionType[],
  "grid.moderator": [
    "grid.read",
    "permission.read",
    "cell.create",
    "cell.read",
    "cell.update",
    "cell.delete",
  ],
  "grid.buyer": ["grid.read", "cell.create", "cell.delete", "permission.read"],
};
