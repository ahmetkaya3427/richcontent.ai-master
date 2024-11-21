import { z } from "zod";

const Schema = z.object({
  id: z.string().transform(Number),
});

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, Schema.parse);
  const userId = event.context.user.id;

  const history = await prisma.histories.findFirst({
    where: { id: query.id, user_id: userId },
  });

  if (!history) throw createError({ statusCode: 400, message: "History not found" });
  return history;
});
