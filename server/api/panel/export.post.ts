import { z } from "zod";
import { Prisma } from "@prisma/client";

const Schema = z.object({
  ids: z.array(z.number()),
  prompt_id: z.string().transform(Number),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, Schema.parse);
  const user = event.context.user;

  const histories = await prisma.histories.findMany({
    where: {
      user_id: user.id,
      id: { in: body.ids },
      prompt_id: body.prompt_id,
      AND: [{ gpt_description: { not: Prisma.JsonNull } }, { gpt_description: { not: {} } }],
    },
  });

  const groups = await prisma.prompt_key_groups.findMany({
    where: { prompt_keys: { some: { prompt_id: body.prompt_id } } },
    include: { prompt_keys: true },
    orderBy: { id: "asc" },
  });

  console.log(groups);

  return { histories, groups };
});
