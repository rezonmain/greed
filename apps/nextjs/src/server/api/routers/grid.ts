import { type Prisma } from "@greed/db";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { creates, deletes, lists, updates } from "~/server/inputs/grid";
import { GridPermission } from "@greed/permissions";

export const gridRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.grid.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  byName: protectedProcedure.input(lists).query(async ({ ctx, input }) => {
    return await ctx.prisma.grid.findMany({
      where: {
        userId: ctx.session.user.id,
        name: {
          contains: input.name,
        },
      },
    });
  }),

  create: protectedProcedure.input(creates).mutation(async ({ ctx, input }) => {
    try {
      const grid = await ctx.prisma.grid.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });

      // Give the creating user grid.owner permissions for the grid
      await ctx.prisma.permission.create({
        data: {
          gridId: grid.id,
          userId: ctx.session.user.id,
          permissions: GridPermission.fromRole("grid.owner").serialized,
        },
      });
    } catch (error) {
      if ((<Prisma.PrismaClientKnownRequestError>error).code === "P2002") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please choose a different name for your grid.",
          cause: error,
        });
      }
      throw error;
    }
  }),

  update: protectedProcedure.input(updates).mutation(async ({ ctx, input }) => {
    try {
      const serializedPermissions = await ctx.prisma.permission.findFirst({
        where: {
          gridId: input.id,
          userId: ctx.session.user.id,
        },
        select: {
          permissions: true,
        },
      });

      if (!serializedPermissions)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Permissions not found.",
        });
      const perm = new GridPermission(serializedPermissions.permissions);
      if (!perm.has("grid.update"))
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have the permissions to update this grid",
        });

      await ctx.prisma.grid.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    } catch (error) {
      if ((<Prisma.PrismaClientKnownRequestError>error).code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The grid you're trying to update does not exist.",
          cause: error,
        });
      }
      throw error;
    }
  }),

  delete: protectedProcedure.input(deletes).mutation(async ({ ctx, input }) => {
    try {
      const serializedPermissions = await ctx.prisma.permission.findFirst({
        where: {
          gridId: input.id,
          userId: ctx.session.user.id,
        },
        select: {
          permissions: true,
        },
      });

      if (!serializedPermissions)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Permissions not found.",
        });
      const perm = new GridPermission(serializedPermissions.permissions);
      if (!perm.has("grid.delete"))
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have the permissions to delete this grid",
        });

      await ctx.prisma.grid.delete({
        where: {
          id: input.id,
        },
      });
    } catch (error) {
      if ((<Prisma.PrismaClientKnownRequestError>error).code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The grid you're trying to delete does not exist.",
          cause: error,
        });
      }
      throw error;
    }
  }),
});
