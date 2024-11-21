import { z } from "zod";

const Schema = z.object({
  page: z.string().transform(Number).default("1"),
  pageCount: z.string().transform(Number).default("10"),
});

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, Schema.parse);
  const page = query.page;
  const pageCount = query.pageCount;
  const totalCount = await prisma.configs.count();

  const data = await prisma.configs.findMany({
    select: {
      id: true,
      name: true,
      domain: true,
    },
    skip: (page - 1) * pageCount,
    take: pageCount,
    orderBy: {
      id: "asc",
    },
  });

  return { data, totalCount, pageCount };
});
