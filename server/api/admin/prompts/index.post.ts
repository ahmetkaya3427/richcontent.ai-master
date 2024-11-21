import { z } from "zod";

const Body = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
  default: z.boolean().optional(),
  language_id: z.string().transform(Number),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, Body.parse);

  const language = await prisma.languages.findUnique({
    where: { id: body.language_id },
  });

  if (!language) throw createError({ statusCode: 400, message: "Language not found" });

  await prisma.prompts.create({
    data: {
      name: body.name,
      content: body.content,
      default: body.default,
      language_id: language.id,
    },
  });

  return { status: true };
});
