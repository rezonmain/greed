export type PermissionsOf<
  Resources extends readonly string[],
  Operations extends readonly string[]
> = `${Resources[number]}.${Operations[number]}`;
