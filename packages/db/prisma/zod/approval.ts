import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteUpdateRequest, RelatedUpdateRequestModel } from "./index"

export const ApprovalModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  approved: z.boolean(),
  approvedAt: z.date().nullish(),
  userId: z.string().nullish(),
})

export interface CompleteApproval extends z.infer<typeof ApprovalModel> {
  user?: CompleteUser | null
  updateRequest?: CompleteUpdateRequest | null
}

/**
 * RelatedApprovalModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedApprovalModel: z.ZodSchema<CompleteApproval> = z.lazy(() => ApprovalModel.extend({
  user: RelatedUserModel.nullish(),
  updateRequest: RelatedUpdateRequestModel.nullish(),
}))
