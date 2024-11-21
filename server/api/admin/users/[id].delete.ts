import { z } from "zod";

const Params = z.object({
  id: z.string().transform(Number),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, Params.parse);

  await prisma.$transaction(async (prisma) => {
    await prisma.tokens.deleteMany({ where: { user_id: params.id } });
    await prisma.histories.deleteMany({ where: { user_id: params.id } });
    await prisma.users.delete({ where: { id: params.id } });
  });

  return { status: true };
});
