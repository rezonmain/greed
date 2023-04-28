import * as z from "zod"
import { CompleteCell, RelatedCellModel, CompletePermission, RelatedPermissionModel, CompleteUser, RelatedUserModel } from "./index"

export const GridModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  widthCells: z.number().int(),
  heightCells: z.number().int(),
  userId: z.string(),
})

export interface CompleteGrid extends z.infer<typeof GridModel> {
  cells: CompleteCell[]
  permissions: CompletePermission[]
  user: CompleteUser
}

/**
 * RelatedGridModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedGridModel: z.ZodSchema<CompleteGrid> = z.lazy(() => GridModel.extend({
  cells: RelatedCellModel.array(),
  permissions: RelatedPermissionModel.array(),
  /**
   * The user who owns the grid
   */
  user: RelatedUserModel,
}))
