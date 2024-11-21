import { z } from "zod";
import { $Enums } from "@prisma/client";

const Params = z.object({
  id: z.string().transform(Number),
});

const Body = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  prompt_id: z.number(),
  type: z.nativeEnum($Enums.input_type),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, Params.parse);
  const data = await readValidatedBody(event, Body.parse);
  await prisma.prompt_keys.update({ where: { id: params.id }, data });
  return { status: true };
});
