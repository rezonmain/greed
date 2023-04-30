import {
  type GridPermissionType,
  gridPermissions,
  gridRolesPermissions,
  type operations,
  type protectedResources,
  type GridRoles,
} from "../definitions/grid";
import { Permission } from "./Permission";

/**
 * @class GridPermission - A class that represents a Grid Permission
 * @param {GridPermissionType[] | number | string} input - The input to create the permission
 * @returns {GridPermission} - A Grid permission
 */
export class GridPermission extends Permission<
  typeof protectedResources,
  typeof operations
> {
  constructor(input: number | string | GridPermissionType[]) {
    super(input, gridPermissions, gridRolesPermissions);
  }
  static from(permission: GridPermissionType[] | number | string) {
    return new GridPermission(permission);
  }
  static fromRole(role: GridRoles) {
    return GridPermission.from(gridRolesPermissions[role]);
  }
}
