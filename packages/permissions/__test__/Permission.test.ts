import { assert, describe, expect, it } from "vitest";
import { Permission } from "../classes/Permission";
import { PermissionType, RP } from "../definition";

describe("Permission class", () => {
  const testCases = [
    { value: 1, serialized: "1", list: ["grid.create"] },
    { value: 2, serialized: "2", list: ["grid.read"] },
    { value: 3, serialized: "3", list: ["grid.create", "grid.read"] },
    { value: 4, serialized: "4", list: ["grid.update"] },
    { value: 5, serialized: "5", list: ["grid.create", "grid.update"] },
    { value: 6, serialized: "6", list: ["grid.read", "grid.update"] },
    {
      value: 7,
      serialized: "7",
      list: ["grid.create", "grid.read", "grid.update"],
    },
    { value: 8, serialized: "8", list: ["grid.delete"] },
    { value: 9, serialized: "9", list: ["grid.create", "grid.delete"] },
    { value: 10, serialized: "10", list: ["grid.read", "grid.delete"] },
    {
      value: 11,
      serialized: "11",
      list: ["grid.create", "grid.read", "grid.delete"],
    },
    { value: 12, serialized: "12", list: ["grid.update", "grid.delete"] },
    {
      value: 13,
      serialized: "13",
      list: ["grid.create", "grid.update", "grid.delete"],
    },
    {
      value: 14,
      serialized: "14",
      list: ["grid.read", "grid.update", "grid.delete"],
    },
    {
      value: 15,
      serialized: "15",
      list: ["grid.create", "grid.read", "grid.update", "grid.delete"],
    },
    { value: 16, serialized: "16", list: ["permission.create"] },
  ];

  describe("constructor", () => {
    it.each(testCases)(
      "should create a correct permission from number $value",
      (test) => {
        const p = new Permission(test.value);
        assert(p.value === test.value);
        assert(p.serialized === test.serialized);
        expect(p.list()).toEqual(test.list);
      }
    );

    it.each(testCases)(
      "should create a correct permission from string $serialized",
      (test) => {
        const p = new Permission(test.serialized);
        assert(p.value === test.value);
        assert(p.serialized === test.serialized);
        expect(p.list()).toEqual(test.list);
      }
    );

    it.each(testCases)(
      "should create a correct permission from array of PermissionType $list",
      (test) => {
        const p = new Permission(test.list as PermissionType[]);
        assert(p.value === test.value);
        assert(p.serialized === test.serialized);
        expect(p.list()).toEqual(test.list);
      }
    );
  });

  describe("static from", () => {
    it.each(testCases)(
      "should create a correct permission from number $value",
      (test) => {
        const p = Permission.from(test.value);
        assert(p.value === test.value);
        assert(p.serialized === test.serialized);
        expect(p.list()).toEqual(test.list);
      }
    );

    it.each(testCases)(
      "should create a correct permission from string $serialized",
      (test) => {
        const p = Permission.from(test.serialized);
        assert(p.value === test.value);
        assert(p.serialized === test.serialized);
        expect(p.list()).toEqual(test.list);
      }
    );

    it.each(testCases)(
      "should create a correct permission from array of PermissionType $list",
      (test) => {
        const p = Permission.from(test.list as PermissionType[]);
        assert(p.value === test.value);
        assert(p.serialized === test.serialized);
        expect(p.list()).toEqual(test.list);
      }
    );
  });

  describe("has", () => {
    const permissions = [
      { p: "approval.create" },
      { p: "approval.delete" },
      { p: "grid.create" },
    ];
    it.each(permissions)(
      "should return true if permission has the $p permission",
      ({ p }) => {
        const perm = new Permission(2305);
        assert(perm.has(p as PermissionType));
      }
    );

    it.each(permissions)(
      "should return false if permission does not have $p permission",
      ({ p }) => {
        const perm = new Permission([
          "grid.update",
          "approval.read",
          "grid.read",
          "approval.update",
          "grid.delete",
          "permission.create",
          "permission.delete",
          "permission.read",
          "permission.update",
        ]);
        assert(!perm.has(p as PermissionType));
      }
    );
  });

  describe("add", () => {
    it("should add a permission", () => {
      const perm = new Permission(0);
      perm.add("grid.create");
      assert(perm.has("grid.create"));
      assert(perm.value !== 0);
    });

    it("should not add a permission if it already exists", () => {
      const perm = new Permission(0);
      perm.add("grid.create");
      perm.add("grid.create");
      assert(perm.has("grid.create"));
      assert(perm.value === 1);
      assert(perm.serialized === "1");
      expect(perm.list()).toEqual(["grid.create"]);
    });

    it("should add multiple permissions", () => {
      const perm = new Permission(0);
      perm.add(["grid.create", "grid.read", "grid.update"]);
      assert(perm.has("grid.create"));
      assert(perm.has("grid.read"));
      assert(perm.has("grid.update"));
      assert(perm.value === 7);
      assert(perm.serialized === "7");
      expect(perm.list()).toEqual(["grid.create", "grid.read", "grid.update"]);
    });
  });

  describe("remove", () => {
    it("should remove a permission", () => {
      const perm = new Permission(15);
      perm.remove("grid.create");
      assert(!perm.has("grid.create"));
      assert(perm.value === 14);
      assert(perm.serialized === "14");
      expect(perm.list()).toEqual(["grid.read", "grid.update", "grid.delete"]);
    });

    it("should not remove a permission if it does not have it", () => {
      const perm = new Permission(15);
      perm.remove("approval.create");
      assert(!perm.has("approval.create"));
      assert(perm.value === 15);
      assert(perm.serialized === "15");
      expect(perm.list()).toEqual([
        "grid.create",
        "grid.read",
        "grid.update",
        "grid.delete",
      ]);
    });

    it("should remove multiple permissions", () => {
      const perm = new Permission(15);
      perm.remove(["grid.create", "grid.read", "grid.update"]);
      assert(!perm.has("grid.create"));
      assert(!perm.has("grid.read"));
      assert(!perm.has("grid.update"));
      assert(perm.has("grid.delete"));
      assert(perm.value === 8);
      assert(perm.serialized === "8");
      expect(perm.list()).toEqual(["grid.delete"]);
    });
  });

  describe("reset", () => {
    it("should reset value to the initial permission value after a permission is removed", () => {
      const perm = new Permission(15);
      perm.remove(["grid.create", "grid.read", "grid.update"]);
      assert(perm.value === 8);
      const { value, serialized } = perm.reset();
      assert(value === 15);
      assert(serialized === "15");
      expect(perm.list()).toEqual([
        "grid.create",
        "grid.read",
        "grid.update",
        "grid.delete",
      ]);
    });

    it("should reset value to the initial permission value after a permission is added", () => {
      const perm = new Permission(15);
      perm.add(["approval.create"]);
      expect(perm.value).toBe(271);
      const { value, serialized } = perm.reset();
      assert(value === 15);
      assert(serialized === "15");
      expect(perm.list()).toEqual([
        "grid.create",
        "grid.read",
        "grid.update",
        "grid.delete",
      ]);
    });
  });

  describe("roles", () => {
    it("should create owner permissions", () => {
      const perm = Permission.fromRole("owner");
      assert(perm.value === 4095);
      assert(perm.serialized === "4095");
      expect(perm.list().sort()).toEqual(RP.owner.sort());
    });

    it("should create moderator permissions", () => {
      const perm = Permission.fromRole("moderator");
      expect(perm.value).toBe(3878);
      expect(perm.serialized).toBe("3878");
      expect(perm.list().sort()).toEqual(RP.moderator.sort());
    });

    it("should create user permissions", () => {
      const perm = Permission.fromRole("user");
      expect(perm.value).toBe(770);
      expect(perm.serialized).toBe("770");
      expect(perm.list().sort()).toMatchObject(RP.user.sort());
    });
  });
});
