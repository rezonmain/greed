import { describe, expect, it } from "vitest";
import { gridPermissions, gridRolesPermissions } from "../definitions/grid";

describe("permissions/gird permissions definition", () => {
  it("should remain constant", () => {
    expect(gridPermissions).toMatchSnapshot();
  });
});

describe("permissions/roles", () => {
  it("should remain constant", () => {
    expect(gridRolesPermissions).toMatchSnapshot();
  });
});
