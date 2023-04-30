import { type PermissionsOf } from "./PermissionsOf";

export type DefinitionOf<
  Resources extends readonly string[],
  Operations extends readonly string[]
> = Readonly<Record<PermissionsOf<Resources, Operations>, number>>;
