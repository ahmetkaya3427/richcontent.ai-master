import { z } from "zod";

const Params = z.object({
  id: z.string().transform(Number), // * Prompt id
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, Params.parse);

  const promptKeys = await prisma.prompt_keys.findMany({
    where: { prompt_id: params.id },
    select: { group_id: true },
  });

  // * Group idleri mapliyoruz:
  const groupIds = promptKeys.map((e) => e.group_id).filter((groupId): groupId is number => groupId !== null);

  // * Çekme işlemi bittiği için prompt_keys'de ilişkili olanları siliyoruz:
  await prisma.prompt_keys.deleteMany({ where: { prompt_id: params.id } });

  // * Prompt key groupstan ilişkili grupları kaldırıyoruz:
  await prisma.prompt_key_groups.deleteMany({
    where: {
      id: { in: groupIds },
      prompt_keys: { none: {} },
    },
  });

  // * Prompta bağlı olan historyleri siliyoruz:
  await prisma.histories.deleteMany({ where: { prompt_id: params.id } });

  // * Promptu siliyoruz:
  await prisma.prompts.deleteMany({ where: { id: params.id } });

  return { status: true };
});
