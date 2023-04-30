import { type PermissionsOf } from "./PermissionOf";

export type DefinitionOf<
  Resources extends readonly string[],
  Operations extends readonly string[]
> = Readonly<Record<PermissionsOf<Resources, Operations>, number>>;
