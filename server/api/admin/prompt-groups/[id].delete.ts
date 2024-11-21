import { z } from "zod";

const Params = z.object({
  id: z.string().transform(Number), // * Group id
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, Params.parse);

  // * Gruba bağlı olan keyleri null olarak setliyoruz:
  await prisma.prompt_keys.updateMany({
    where: { group_id: params.id },
    data: { group_id: null },
  });

  // * Grupları siliyoruz:
  await prisma.prompt_key_groups.delete({ where: { id: params.id } });
  return { status: true };
});
