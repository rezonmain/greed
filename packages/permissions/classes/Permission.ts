import z from "zod";
import { type IPermission } from "../interfaces/IPermission";
import { type PermissionsOf } from "../types/PermissionsOf";
import { type DefinitionOf } from "../types/DefinitionOf";

/**
 * @class Permission - A base class that represents a generic Permission for a resource
 * @param {PermissionsOf<R, O>[] | number | string} input - The input to create the permission
 * @param {DefinitionOf<R, O>} definition - The definition of the permissions
 * @param {Readonly<Record<string, PermissionsOf<R, O>[]>>} roleDefinition - The definition of the roles
 * @returns {Permission<R, O>} - A permission
 */
export class Permission<
  R extends readonly string[],
  O extends readonly string[]
> implements IPermission<R, O>
{
  permissions: { serialized: string; value: number };
  original: { serialized: string; value: number };
  DEF: Readonly<Record<`${R[number]}.${O[number]}`, number>>;
  ROLE_DEF: Readonly<Record<string, PermissionsOf<R, O>[]>>;

  constructor(
    input: PermissionsOf<R, O>[] | number | string,
    definition: DefinitionOf<R, O>,
    roleDefinition: Readonly<Record<string, PermissionsOf<R, O>[]>>
  ) {
    this.DEF = definition;
    this.ROLE_DEF = roleDefinition;
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
      const value = input.reduce((acc, curr) => acc | this.DEF[curr], 0);
      calculatedPermissions = {
        serialized: value.toString(),
        value,
      };
    }
    this.permissions = calculatedPermissions;
    this.original = { ...this.permissions };
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

  has(permission: PermissionsOf<R, O> | PermissionsOf<R, O>[]): boolean {
    if (Array.isArray(permission)) {
      return permission.every((perm) => this.has(perm));
    }
    return (
      (this.permissions.value & this.DEF[permission]) === this.DEF[permission]
    );
  }

  list(): PermissionsOf<R, O>[] {
    return Object.keys(this.DEF).filter((key) =>
      this.has(key as PermissionsOf<R, O>)
    ) as PermissionsOf<R, O>[];
  }

  add(
    permission: PermissionsOf<R, O> | PermissionsOf<R, O>[],
    serialized?: boolean
  ) {
    if (Array.isArray(permission)) {
      const newPermission = permission.reduce(
        (acc, curr) => acc | this.DEF[curr],
        this.permissions.value
      );
      this.#setPermissions({
        serialized: newPermission.toString(),
        value: newPermission,
      });
      return serialized ? newPermission.toString() : newPermission;
    }

    const newPermission = this.permissions.value | this.DEF[permission];
    this.#setPermissions({
      serialized: newPermission.toString(),
      value: newPermission,
    });
    return serialized ? newPermission.toString() : newPermission;
  }

  remove(
    permission: PermissionsOf<R, O> | PermissionsOf<R, O>[],
    serialized?: boolean
  ) {
    if (!this.has(permission)) return;

    if (Array.isArray(permission)) {
      const newPermission = permission.reduce(
        (acc, curr) => acc ^ this.DEF[curr],
        this.permissions.value
      );
      this.#setPermissions({
        serialized: newPermission.toString(),
        value: newPermission,
      });
      return serialized ? newPermission.toString() : newPermission;
    }

    const newPermission = this.permissions.value ^ this.DEF[permission];
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
}
