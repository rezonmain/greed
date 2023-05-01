import { CellModel } from "@greed/db";

export const listsByGridId = CellModel.pick({
  gridId: true,
  approved: true,
  approvedById: true,
  approvedAt: true,
}).partial({
  approved: true,
  approvedById: true,
  approvedAt: true,
});

export const creates = CellModel.pick({
  gridId: true,
  row: true,
  column: true,
  contentId: true,
});

export const deletes = CellModel.pick({
  id: true,
});
