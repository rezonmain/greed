import { PERM, PermissionType } from "../definition";
import z from "zod";

export class Permission {
  permissions: { serialized: string; value: number };
  original: { serialized: string; value: number };

  constructor(serialized: string) {
    this.permissions = {
      serialized,
      value: z.number().parse(serialized),
    };
    this.original = { ...this.permissions };
  }

  #setPermissions(permissions: { serialized: string; value: number }) {
    this.permissions = permissions;
  }

  getValue(): number {
    return this.permissions.value;
  }

  getSerialized(): string {
    return this.permissions.serialized;
  }

  list(): PermissionType[] {
    return Object.keys(PERM).filter((key) =>
      this.has(key as PermissionType)
    ) as PermissionType[];
  }

  has(permission: PermissionType) {
    return (this.permissions.value & PERM[permission]) === PERM[permission];
  }

  add(permission: PermissionType, serialized?: boolean) {
    const newPermission = this.permissions.value | PERM[permission];
    this.#setPermissions({
      serialized: newPermission.toString(),
      value: newPermission,
    });
    return serialized ? newPermission.toString() : newPermission;
  }

  remove(permission: PermissionType, serialized?: boolean) {
    const newPermission = this.permissions.value ^ PERM[permission];
    this.#setPermissions({
      serialized: newPermission.toString(),
      value: newPermission,
    });
    return serialized ? newPermission.toString() : newPermission;
  }

  reset() {
    this.#setPermissions(this.original);
    return this.original.serialized;
  }
}
