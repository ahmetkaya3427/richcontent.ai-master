import { z } from "zod";
import { $Enums } from "@prisma/client";

const Body = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  prompt_id: z.string().transform(Number),
  type: z.nativeEnum($Enums.input_type),
});

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, Body.parse);
  await prisma.prompt_keys.create({ data });
  return { status: true };
});
