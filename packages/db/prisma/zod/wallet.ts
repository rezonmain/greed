import * as z from "zod"
import { CompleteUser, RelatedUserModel } from "./index"

export const WalletModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  address: z.string(),
  balance: z.number(),
  userId: z.string(),
})

export interface CompleteWallet extends z.infer<typeof WalletModel> {
  user: CompleteUser
}

/**
 * RelatedWalletModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedWalletModel: z.ZodSchema<CompleteWallet> = z.lazy(() => WalletModel.extend({
  user: RelatedUserModel,
}))
