import * as z from "zod"
import { CompleteGrid, RelatedGridModel } from "./index"

export const GridMetaModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  widthCells: z.number().int(),
  heightCells: z.number().int(),
})

export interface CompleteGridMeta extends z.infer<typeof GridMetaModel> {
  grid?: CompleteGrid | null
}

/**
 * RelatedGridMetaModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedGridMetaModel: z.ZodSchema<CompleteGridMeta> = z.lazy(() => GridMetaModel.extend({
  grid: RelatedGridModel.nullish(),
}))
