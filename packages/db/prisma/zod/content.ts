import * as z from "zod"
import { CompleteCell, RelatedCellModel } from "./index"

export const ContentModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  type: z.string(),
  name: z.string().nullish(),
  data: z.string().nullish(),
  url: z.string().nullish(),
})

export interface CompleteContent extends z.infer<typeof ContentModel> {
  cells: CompleteCell[]
}

/**
 * RelatedContentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedContentModel: z.ZodSchema<CompleteContent> = z.lazy(() => ContentModel.extend({
  cells: RelatedCellModel.array(),
}))
