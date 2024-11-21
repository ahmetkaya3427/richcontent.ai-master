import { z } from "zod";

const Schema = z.object({
  prompt_id: z.string().transform(Number),
  page: z.string().transform(Number).default("1"),
  pageCount: z.string().transform(Number).default("10"),
});

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, Schema.parse);
  const page = query.page;
  const pageCount = query.pageCount;

  const totalCount = await prisma.prompt_key_groups.count({
    where: {
      prompt_keys: {
        some: { prompt_id: query.prompt_id },
      },
    },
  });

  const data = await prisma.prompt_key_groups.findMany({
    where: {
      prompt_keys: {
        some: { prompt_id: query.prompt_id },
      },
    },
    skip: (page - 1) * pageCount,
    take: pageCount,
    orderBy: { id: "asc" },
  });

  return { data, totalCount, pageCount };
});
