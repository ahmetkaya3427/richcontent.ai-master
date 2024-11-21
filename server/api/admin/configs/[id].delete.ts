import { z } from "zod";

const Params = z.object({
  id: z.string().transform(Number),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, Params.parse);
  await prisma.configs.delete({ where: { id: params.id } });
  return { status: true };
});
