import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const gridRouter = createTRPCRouter({
  getAllFromUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.grid.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
