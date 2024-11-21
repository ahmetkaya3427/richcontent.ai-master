import { z } from "zod";

const Params = z.object({
  id: z.string().transform(Number),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, Params.parse);

  const details = await prisma.languages.findFirst({
    where: { id: params.id },
  });

  if (!details) {
    throw createError({ statusCode: 400, message: "Details not found" });
  }

  return details;
});
