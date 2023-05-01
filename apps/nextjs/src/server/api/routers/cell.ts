import { type Prisma } from "@greed/db";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { creates, deletes, listsByGridId } from "~/server/inputs/cell";
import { throwIfForbidden } from "~/utils/permissions/grid";

export const cellRouter = createTRPCRouter({
  listByGridId: protectedProcedure
    .input(listsByGridId)
    .query(async ({ ctx, input }) => {
      try {
        await throwIfForbidden({
          ctx,
          gridId: input.gridId,
          message: "You do not have permission to view this grid's cells",
          needs: "cell.read",
        });
        return await ctx.prisma.cell.findMany({
          where: {
            ...input,
          },
        });
      } catch (error) {
        throw error;
      }
    }),

  listMineByGridId: protectedProcedure
    .input(listsByGridId)
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.cell.findMany({
        where: {
          gridId: input.gridId,
          userId: ctx.session.user.id,
        },
      });
    }),

  listMine: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.cell.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  create: protectedProcedure.input(creates).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.cell.create({
      data: {
        ...input,
        userId: ctx.session.user.id,
      },
    });
  }),

  delete: protectedProcedure.input(deletes).mutation(async ({ ctx, input }) => {
    try {
      // Get the author, and gridId of the cell
      const cell = await ctx.prisma.cell.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        select: {
          userId: true,
          gridId: true,
        },
      });

      // If the author is not the current user, check if the current user has the permission to delete the grid
      if (cell.userId !== ctx.session.user.id) {
        await throwIfForbidden({
          ctx,
          gridId: cell.gridId,
          message: "You do not have permission to delete this cell",
          needs: "cell.delete",
        });
      }

      await ctx.prisma.cell.delete({
        where: {
          id: input.id,
        },
      });
    } catch (error) {
      if ((<Prisma.PrismaClientKnownRequestError>error).code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The cell you're trying to delete does not exist.",
          cause: error,
        });
      }
      throw error;
    }
  }),
});
