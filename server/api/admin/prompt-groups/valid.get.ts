import { z } from "zod";

const Schema = z.object({
  prompt_id: z.string().transform(Number),
});

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, Schema.parse);

  const data = await prisma.prompt_keys.findMany({
    where: {
      prompt_id: query.prompt_id,
      group_id: null,
    },
    orderBy: { id: "asc" },
  });

  return data;
});
