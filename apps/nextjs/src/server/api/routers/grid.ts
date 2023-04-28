import { Prisma } from "@greed/db";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { create } from "~/server/inputs/grid";

export const gridRouter = createTRPCRouter({
  gridList: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.grid.findMany({
      where: {
        userId: ctx.session.user.id,
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
});
