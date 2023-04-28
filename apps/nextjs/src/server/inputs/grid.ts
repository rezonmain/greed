import { GridModel } from "@greed/db";

export const create = GridModel.pick({
  name: true,
  heightCells: true,
  widthCells: true,
});

export const list = GridModel.pick({
  name: true,
}).partial({ name: true });

export const update = GridModel.pick({
  id: true,
  name: true,
  heightCells: true,
  widthCells: true,
}).partial({
  name: true,
  heightCells: true,
  widthCells: true,
});
