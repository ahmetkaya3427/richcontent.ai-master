export default defineEventHandler(async (event) => {
  const userId = event.context.user.id;
  return await prisma.histories.findMany({
    where: { user_id: userId },
    select: {
      id: true,
      link: true,
      images: true,
      created_at: true,
      product_title: true,
      product_description: true,
      gpt_description: true,
    },
    orderBy: { id: "desc" },
  });
});
