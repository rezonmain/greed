import { type PermissionsOf } from "../types/PermissionsOf";
import { type DefinitionOf } from "../types/DefinitionOf";
import { z } from "zod";

export default abstract class IPermission<
  Resources extends readonly string[],
  Operations extends readonly string[]
> {
  permissions: { serialized: string; value: number };
  original: { serialized: string; value: number };
  DEF: DefinitionOf<Resources, Operations>;
  ROLE_DEF: Readonly<Record<string, PermissionsOf<Resources, Operations>[]>>;

  constructor(
    input: PermissionsOf<Resources, Operations>[] | number | string,
    definition: DefinitionOf<Resources, Operations>,
    roleDefinition: Readonly<
      Record<string, PermissionsOf<Resources, Operations>[]>
    >
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

  abstract get value(): number;
  abstract get serialized(): string;
  abstract has(
    permission:
      | PermissionsOf<Resources, Operations>
      | PermissionsOf<Resources, Operations>[]
  ): boolean;
  abstract list(): PermissionsOf<Resources, Operations>[];
  abstract add(
    permission:
      | PermissionsOf<Resources, Operations>
      | PermissionsOf<Resources, Operations>[],
    serialized?: boolean
  ): string | number;
  abstract remove(
    permission:
      | PermissionsOf<Resources, Operations>
      | PermissionsOf<Resources, Operations>[],
    serialized?: boolean
  ): string | number | undefined;
  abstract reset(): { serialized: string; value: number };
}
