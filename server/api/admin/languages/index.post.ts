import { z } from "zod";

const Body = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, Body.parse);
  await prisma.languages.create({ data });
  return { status: true };
});
