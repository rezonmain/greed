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

  gridCreate: protectedProcedure.input(create).mutation(({ ctx, input }) => {
    return ctx.prisma.grid.create({
      data: {
        ...input,
        userId: ctx.session.user.id,
      },
    });
  }),
});
