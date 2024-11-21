import { z } from "zod";

const Params = z.object({
  id: z.string().transform(Number),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, Params.parse);

  const details = await prisma.users.findFirst({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      phone: true,
      username: true,
      password: false,
      credit: true,
      role: true,
    },
  });

  if (!details) {
    throw createError({ statusCode: 400, message: "Details not found" });
  }

  return details;
});
