import * as z from "zod"
import { CompleteGrid, RelatedGridModel, CompleteContent, RelatedContentModel, CompleteUser, RelatedUserModel } from "./index"

export const CellModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  column: z.number().int(),
  row: z.number().int(),
  gridId: z.string(),
  contentId: z.string(),
  userId: z.string(),
  approved: z.boolean(),
  approvedAt: z.date().nullish(),
  approvedById: z.string().nullish(),
})

export interface CompleteCell extends z.infer<typeof CellModel> {
  grid: CompleteGrid
  content: CompleteContent
  user: CompleteUser
  approvedBy?: CompleteUser | null
}

/**
 * RelatedCellModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCellModel: z.ZodSchema<CompleteCell> = z.lazy(() => CellModel.extend({
  grid: RelatedGridModel,
  content: RelatedContentModel,
  /**
   * The user who's the author of the cell
   */
  user: RelatedUserModel,
  /**
   * The user who approved the cell
   */
  approvedBy: RelatedUserModel.nullish(),
}))
