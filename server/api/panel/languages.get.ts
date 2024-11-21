export default defineEventHandler(async () => {
  return await prisma.languages.findMany({
    select: {
      id: true,
      name: true,
      code: true,
    },
  });
});
