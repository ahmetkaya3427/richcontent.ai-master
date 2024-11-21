import { z } from "zod";

const Body = z.object({
  id: z.number(),
  chatgpt_api_key: z.string(),
});

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, Body.parse);
  await prisma.settings.update({ where: { id: data.id }, data });
  return { status: true };
});
