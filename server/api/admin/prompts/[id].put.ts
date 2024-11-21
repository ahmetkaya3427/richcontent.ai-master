import { z } from "zod";

const Params = z.object({
  id: z.string().transform(Number),
});

const Body = z.object({
  name: z.string().min(1),
  default: z.boolean().optional(),
  content: z.string().min(1),
  language_id: z.string().transform(Number),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, Params.parse);
  const body = await readValidatedBody(event, Body.parse);

  await prisma.prompts.update({
    where: { id: params.id },
    data: body,
  });

  return { status: true };
});
