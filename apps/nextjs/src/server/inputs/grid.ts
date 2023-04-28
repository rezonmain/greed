import { GridModel } from "@greed/db";

export const create = GridModel.pick({
  name: true,
  heightCells: true,
  widthCells: true,
});
