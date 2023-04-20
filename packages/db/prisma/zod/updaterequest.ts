import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteGrid, RelatedGridModel, CompleteCell, RelatedCellModel, CompleteApproval, RelatedApprovalModel } from "./index"

export const UpdateRequestModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  gridId: z.string(),
  approvalId: z.string(),
})

export interface CompleteUpdateRequest extends z.infer<typeof UpdateRequestModel> {
  user: CompleteUser
  grid: CompleteGrid
  cells: CompleteCell[]
  approval: CompleteApproval
}

/**
 * RelatedUpdateRequestModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUpdateRequestModel: z.ZodSchema<CompleteUpdateRequest> = z.lazy(() => UpdateRequestModel.extend({
  user: RelatedUserModel,
  grid: RelatedGridModel,
  cells: RelatedCellModel.array(),
  approval: RelatedApprovalModel,
}))
