import { Prisma } from "@greed/db";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { creates, deletes, lists, updates } from "~/server/inputs/grid";

export const gridRouter = createTRPCRouter({
  gridList: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.grid.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  gridByName: protectedProcedure.input(lists).query(async ({ ctx, input }) => {
    return await ctx.prisma.grid.findMany({
      where: {
        userId: ctx.session.user.id,
        name: {
          contains: input.name,
        },
      },
    });
  }),

  gridCreate: protectedProcedure
    .input(creates)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.grid.create({
          data: {
            ...input,
            userId: ctx.session.user.id,
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

  gridUpdate: protectedProcedure
    .input(updates)
    .mutation(async ({ ctx, input }) => {
      try {
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

  gridDelete: protectedProcedure
    .input(deletes)
    .mutation(async ({ ctx, input }) => {
      try {
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
