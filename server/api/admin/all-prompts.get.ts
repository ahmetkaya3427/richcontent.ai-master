export default defineEventHandler(async () => {
  return await prisma.prompts.findMany({
    select: { id: true, name: true, language: { select: { code: true } } },
    orderBy: { id: "asc" },
  });
});
