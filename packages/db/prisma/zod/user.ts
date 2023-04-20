import * as z from "zod"
import { CompleteAccount, RelatedAccountModel, CompleteSession, RelatedSessionModel, CompletePermission, RelatedPermissionModel, CompleteWallet, RelatedWalletModel, CompleteUpdateRequest, RelatedUpdateRequestModel, CompleteCell, RelatedCellModel, CompleteGrid, RelatedGridModel, CompleteApproval, RelatedApprovalModel } from "./index"

export const UserModel = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  emailVerified: z.date().nullish(),
  image: z.string().nullish(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  accounts: CompleteAccount[]
  sessions: CompleteSession[]
  permission: CompletePermission[]
  wallets: CompleteWallet[]
  updateRequests: CompleteUpdateRequest[]
  cells: CompleteCell[]
  grids: CompleteGrid[]
  Approval: CompleteApproval[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  accounts: RelatedAccountModel.array(),
  sessions: RelatedSessionModel.array(),
  permission: RelatedPermissionModel.array(),
  wallets: RelatedWalletModel.array(),
  updateRequests: RelatedUpdateRequestModel.array(),
  cells: RelatedCellModel.array(),
  grids: RelatedGridModel.array(),
  Approval: RelatedApprovalModel.array(),
}))
