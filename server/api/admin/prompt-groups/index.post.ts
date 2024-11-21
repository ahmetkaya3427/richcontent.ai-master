import { z } from "zod";

const Body = z.object({
  name: z.string().min(1),
  ids: z.array(z.number()).min(1),
  prompt_id: z.string().transform(Number),
});

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, Body.parse);

  const promptExists = await prisma.prompts.findFirst({
    where: { id: data.prompt_id },
  });

  if (!promptExists) {
    throw createError({ statusCode: 400, message: "Prompt not found" });
  }

  const promptKeys = await prisma.prompt_keys.findMany({
    where: { prompt_id: data.prompt_id },
    select: { id: true },
  });

  const validIds = promptKeys.map((key) => key.id);
  const allValid = data.ids.every((id) => validIds.includes(id));

  if (!allValid) {
    throw createError({ statusCode: 400, message: "Ids validation error" });
  }

  const newGroup = await prisma.prompt_key_groups.create({
    data: { name: data.name },
  });

  await prisma.prompt_keys.updateMany({
    where: {
      id: { in: data.ids },
      prompt_id: data.prompt_id,
    },
    data: { group_id: newGroup.id },
  });

  return { status: true };
});
