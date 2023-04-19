import z from "zod";

export const hello = z.object({ text: z.string() });
export const getAll = {};
export const getSecretMessage = {};

export default { hello, getAll, getSecretMessage };
