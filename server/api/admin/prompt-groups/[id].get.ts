import { z } from "zod";

const Params = z.object({
  id: z.string().transform(Number),
});

const Query = z.object({
  prompt_id: z.string().transform(Number),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, Params.parse);
  const query = await getValidatedQuery(event, Query.parse);

  const keys = await prisma.prompt_keys.findMany({
    where: {
      prompt_id: query.prompt_id,
      OR: [{ group_id: params.id }, { group_id: null }],
    },
    select: {
      id: true,
      name: true,
      group_id: true,
    },
  });

  const processedKeys = keys.map((key) => ({ ...key, selected: key.group_id === params.id }));

  const data = await prisma.prompt_key_groups.findFirst({
    where: { id: params.id },
  });

  if (!data) {
    throw createError({ statusCode: 400, message: "Prompt key groups not found" });
  }

  return { data, keys: processedKeys };
});
