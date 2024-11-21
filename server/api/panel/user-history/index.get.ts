import { z } from "zod";

const Schema = z.object({
  page: z.string().transform(Number).default("1"),
  pageCount: z.string().transform(Number).default("100"),
});

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, Schema.parse);
  const page = query.page;
  const pageCount = query.pageCount;
  const userId = event.context.user.id;

  const totalCount = await prisma.histories.count({
    where: { user_id: userId },
  });

  const data = await prisma.histories.findMany({
    where: {
      user_id: userId,
      gpt_description: { not: "" },
    },
    select: {
      id: true,
      link: true,
      images: true,
      created_at: true,
      product_title: true,
      gpt_description: true,
      product_description: true,
      prompt: {
        select: {
          id: true,
          language: {
            select: {
              code: true,
            },
          },
        },
      },
    },
    skip: (page - 1) * pageCount,
    take: pageCount,
    orderBy: { id: "desc" },
  });

  return { data, totalCount, pageCount };
});
