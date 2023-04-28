import { describe, expect, it } from "vitest";
import { PERM, RP } from "../definition";

describe("permissions/definition", () => {
  it("should remain constant", () => {
    expect(PERM).toMatchSnapshot();
  });
});

describe("permissions/roles", () => {
  it("should remain constant", () => {
    expect(RP).toMatchSnapshot();
  });
});
