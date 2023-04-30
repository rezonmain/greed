import { GridPermission } from "@greed/permissions";
import { type GridPermissionType } from "@greed/permissions/definitions/grid";
import { TRPCError } from "@trpc/server";
import { type TRPCProtectedContext } from "~/server/api/trpc";

export const throwIfForbidden = async ({
  ctx,
  gridId,
  message,
  needs,
}: {
  ctx: TRPCProtectedContext;
  gridId: string;
  message: string;
  needs: GridPermissionType;
}) => {
  const serializedPermissions = await getSerializedGridPermissions(ctx, gridId);
  if (!serializedPermissions)
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Permissions not found.",
    });
  const perm = new GridPermission(serializedPermissions.permissions);
  if (!perm.has(needs))
    throw new TRPCError({
      code: "FORBIDDEN",
      message,
    });
};

const getSerializedGridPermissions = async (
  ctx: TRPCProtectedContext,
  gridId: string
) => {
  return await ctx.prisma.permission.findFirst({
    where: {
      gridId,
      userId: ctx.session.user.id,
    },
    select: {
      permissions: true,
    },
  });
};
