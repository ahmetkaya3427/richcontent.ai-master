import { z } from "zod";

const Schema = z.object({
  history_ids: z.array(z.number()),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, Schema.parse);

  const user = event.context.user;
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

  await prisma.histories.deleteMany({ where: { user_id: user.id, id: { in: body.history_ids } } });
  return { status: true };
});
