import { z } from "zod";

const Schema = z.object({
  id: z.number(),
  description: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, Schema.parse);
  const user = event.context.user;

  await prisma.histories.update({
    where: { id: body.id, user_id: user.id },
    data: { gpt_description: body.description },
  });

  return { status: true };
});
