import { z } from "zod";

const Params = z.object({
  id: z.string().transform(Number), // * Key id
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, Params.parse);

  const promptKey = await prisma.prompt_keys.findUnique({
    where: { id: params.id },
    select: { group_id: true },
  });

  if (!promptKey || !promptKey.group_id) {
    throw createError({ statusCode: 400, message: "Delete error" });
  }

  await prisma.prompt_keys.delete({ where: { id: params.id } });

  const remainingKeys = await prisma.prompt_keys.findMany({
    where: { group_id: promptKey.group_id },
  });

  if (!remainingKeys.length) {
    await prisma.prompt_key_groups.delete({ where: { id: promptKey.group_id } });
  }

  return { status: true };
});
