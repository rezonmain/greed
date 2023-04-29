import { type Prisma } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";

export default function cuid2(
  params: Prisma.MiddlewareParams,
  next: (params: Prisma.MiddlewareParams) => Promise<unknown>
) {
  if (params.action === "create" || params.action === "createMany") {
    params.args.data.id ??= createId();
  }
  if (params.action === "createMany") {
    (<{ id: string }[]>params.args.data).forEach((data) => {
      data.id ??= createId();
    });
  }
  return next(params);
}
