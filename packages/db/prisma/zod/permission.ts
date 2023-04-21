import * as z from "zod"
import { CompleteGrid, RelatedGridModel, CompleteUser, RelatedUserModel } from "./index"

export const PermissionModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  /**
   * Serialized string of the permissions, permissions are represented as bit flags
   */
  permissions: z.string(),
  gridId: z.string(),
  userId: z.string(),
})

export interface CompletePermission extends z.infer<typeof PermissionModel> {
  grid: CompleteGrid
  user: CompleteUser
}

/**
 * RelatedPermissionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPermissionModel: z.ZodSchema<CompletePermission> = z.lazy(() => PermissionModel.extend({
  grid: RelatedGridModel,
  user: RelatedUserModel,
}))
