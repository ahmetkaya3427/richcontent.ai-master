import { z } from "zod";

const Schema = z.object({
  language_id: z.string().transform(Number),
  page: z.string().transform(Number).default("1"),
  pageCount: z.string().transform(Number).default("10"),
});

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, Schema.parse);
  const page = query.page;
  const pageCount = query.pageCount;
  const totalCount = await prisma.prompts.count();

  const language = await prisma.languages.findUnique({
    where: { id: query.language_id },
  });

  if (!language) throw createError({ statusCode: 400, message: "Language not found" });

  const data = await prisma.prompts.findMany({
    where: { language_id: language.id },
    skip: (page - 1) * pageCount,
    take: pageCount,
    orderBy: { id: "asc" },
  });

  return { data, totalCount, pageCount };
});
