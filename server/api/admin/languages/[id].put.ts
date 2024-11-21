import { z } from "zod";

const Params = z.object({
  id: z.string().transform(Number),
});

const Body = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, Params.parse);
  const body = await readValidatedBody(event, Body.parse);

  await prisma.languages.update({
    where: { id: params.id },
    data: body,
  });

  return { status: true };
});
