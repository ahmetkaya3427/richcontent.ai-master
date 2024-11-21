import { z } from "zod";

const Schema = z.object({
  language: z.string(),
});

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, Schema.parse);
  const userId = event.context.user.id;

  const language = await prisma.languages.findUnique({
    where: { code: query.language },
  });

  if (!language) {
    throw createError({ statusCode: 400, message: "Language not found" });
  }

  const userPrompts = await prisma.user_prompts.findMany({
    where: { user_id: userId },
    select: { prompt_id: true },
  });

  const prompts = await prisma.prompts.findMany({
    where: {
      language_id: language.id,
      OR: [{ default: true }, { id: { in: userPrompts.map((prompt) => prompt.prompt_id) } }],
      prompt_keys: { some: {} },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return prompts;
});
