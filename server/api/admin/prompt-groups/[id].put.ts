import { z } from "zod";

const Params = z.object({
  id: z.string().transform(Number),
});

const Body = z.object({
  name: z.string().min(1),
  ids: z.array(z.number()).min(1),
  prompt_id: z.string().transform(Number),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, Params.parse);
  const data = await readValidatedBody(event, Body.parse);

  const promptExists = await prisma.prompts.findFirst({
    where: { id: data.prompt_id },
  });

  if (!promptExists) {
    throw createError({ statusCode: 400, message: "Prompt not found" });
  }

  await prisma.prompt_keys.updateMany({
    where: { prompt_id: data.prompt_id, group_id: params.id },
    data: { group_id: null },
  });

  await prisma.prompt_keys.updateMany({
    where: { id: { in: data.ids }, prompt_id: data.prompt_id },
    data: { group_id: params.id },
  });

  return { status: true };
});
