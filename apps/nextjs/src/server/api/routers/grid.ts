import { Prisma } from "@greed/db";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { create, list, update } from "~/server/inputs/grid";

export const gridRouter = createTRPCRouter({
  gridList: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.grid.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  gridByName: protectedProcedure.input(list).query(async ({ ctx, input }) => {
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
    .input(create)
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
    .input(update)
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
});
