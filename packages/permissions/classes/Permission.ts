import { PERM, type PermissionType, RP, type Roles } from "../definition";
import z from "zod";

export class Permission {
  permissions: { serialized: string; value: number };
  original: { serialized: string; value: number };
  static PERM = PERM;

  constructor(input: PermissionType[] | number | string) {
    let calculatedPermissions = {
      serialized: "0",
      value: 0,
    };

    if (typeof input === "number") {
      calculatedPermissions = {
        serialized: input.toString(),
        value: input,
      };
    }
    if (typeof input === "string") {
      calculatedPermissions = {
        serialized: input,
        value: z.coerce.number().parse(input),
      };
    } else if (Array.isArray(input)) {
      const value = input.reduce((acc, curr) => acc | PERM[curr], 0);
      calculatedPermissions = {
        serialized: value.toString(),
        value,
      };
    }
    this.permissions = calculatedPermissions;
    this.original = { ...this.permissions };
    return;
  }

  #setPermissions(permissions: { serialized: string; value: number }) {
    this.permissions = permissions;
  }

  get value(): number {
    return this.permissions.value;
  }

  get serialized(): string {
    return this.permissions.serialized;
  }

  has(permission: PermissionType | PermissionType[]): boolean {
    if (Array.isArray(permission)) {
      return permission.every((perm) => this.has(perm));
    }
    return (this.permissions.value & PERM[permission]) === PERM[permission];
  }

  list(): PermissionType[] {
    return Object.keys(PERM).filter((key) =>
      this.has(key as PermissionType)
    ) as PermissionType[];
  }

  add(permission: PermissionType | PermissionType[], serialized?: boolean) {
    if (Array.isArray(permission)) {
      const newPermission = permission.reduce(
        (acc, curr) => acc | PERM[curr],
        this.permissions.value
      );
      this.#setPermissions({
        serialized: newPermission.toString(),
        value: newPermission,
      });
      return serialized ? newPermission.toString() : newPermission;
    }

    const newPermission = this.permissions.value | PERM[permission];
    this.#setPermissions({
      serialized: newPermission.toString(),
      value: newPermission,
    });
    return serialized ? newPermission.toString() : newPermission;
  }

  remove(permission: PermissionType | PermissionType[], serialized?: boolean) {
    if (!this.has(permission)) return;

    if (Array.isArray(permission)) {
      const newPermission = permission.reduce(
        (acc, curr) => acc ^ PERM[curr],
        this.permissions.value
      );
      this.#setPermissions({
        serialized: newPermission.toString(),
        value: newPermission,
      });
      return serialized ? newPermission.toString() : newPermission;
    }

    const newPermission = this.permissions.value ^ PERM[permission];
    this.#setPermissions({
      serialized: newPermission.toString(),
      value: newPermission,
    });
    return serialized ? newPermission.toString() : newPermission;
  }

  reset() {
    this.#setPermissions(this.original);
    return this.permissions;
  }

  static from(permission: PermissionType[] | number | string) {
    return new Permission(permission);
  }

  static fromRole(role: Roles) {
    switch (role) {
      case "owner":
        return Permission.from(RP.owner);
      case "moderator":
        return Permission.from(RP.moderator);
      case "user":
        return Permission.from(RP.user);
      default:
        return Permission.from([]);
    }
  }
}
