import * as z from "zod"
import { CompleteAccount, RelatedAccountModel, CompleteSession, RelatedSessionModel, CompletePermission, RelatedPermissionModel, CompleteWallet, RelatedWalletModel, CompleteCell, RelatedCellModel, CompleteGrid, RelatedGridModel } from "./index"

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
  cells: CompleteCell[]
  approvals: CompleteCell[]
  grids: CompleteGrid[]
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
  cells: RelatedCellModel.array(),
  approvals: RelatedCellModel.array(),
  grids: RelatedGridModel.array(),
}))
