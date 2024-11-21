import { z } from "zod";

const Schema = z.object({
  page: z.string().transform(Number).default("1"),
  pageCount: z.string().transform(Number).default("10"),
});

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, Schema.parse);
  const page = query.page;
  const pageCount = query.pageCount;
  const totalCount = await prisma.histories.count();

  const data = await prisma.histories.findMany({
    select: {
      id: true,
      link: true,
      created_at: true,
    },
    skip: (page - 1) * pageCount,
    take: pageCount,
    orderBy: { id: "desc" },
  });

  return { data, totalCount, pageCount };
});
