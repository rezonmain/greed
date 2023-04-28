import { GridModel } from "@greed/db";

export const creates = GridModel.pick({
  name: true,
  heightCells: true,
  widthCells: true,
});

export const lists = GridModel.pick({
  name: true,
}).partial({ name: true });

export const updates = GridModel.pick({
  id: true,
  name: true,
  heightCells: true,
  widthCells: true,
}).partial({
  name: true,
  heightCells: true,
  widthCells: true,
});

export const deletes = GridModel.pick({ id: true });
