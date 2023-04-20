import * as z from "zod"
import { CompleteGrid, RelatedGridModel, CompleteContent, RelatedContentModel, CompleteUser, RelatedUserModel, CompleteUpdateRequest, RelatedUpdateRequestModel } from "./index"

export const CellModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  gridId: z.string(),
  column: z.number().int(),
  row: z.number().int(),
  contentId: z.string(),
  userId: z.string(),
  updateRequestId: z.string().nullish(),
})

export interface CompleteCell extends z.infer<typeof CellModel> {
  grid: CompleteGrid
  content: CompleteContent
  user: CompleteUser
  updateRequest?: CompleteUpdateRequest | null
}

/**
 * RelatedCellModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCellModel: z.ZodSchema<CompleteCell> = z.lazy(() => CellModel.extend({
  grid: RelatedGridModel,
  content: RelatedContentModel,
  user: RelatedUserModel,
  updateRequest: RelatedUpdateRequestModel.nullish(),
}))
