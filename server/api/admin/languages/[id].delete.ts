import { z } from "zod";

const Params = z.object({
  id: z.string().transform(Number), // * Language id
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, Params.parse);

  const prompts = await prisma.prompts.findMany({
    where: { language_id: params.id },
  });

  for (const prompt of prompts) {
    // * Prompt.id'den prompt_keys çekiyoruz:
    const promptKeys = await prisma.prompt_keys.findMany({
      where: { prompt_id: prompt.id },
      select: { group_id: true },
    });

    // * Group idleri mapliyoruz:
    const groupIds = promptKeys.map((e) => e.group_id).filter((groupId): groupId is number => groupId !== null);

    // * Çekme işlemi bittiği için prompt_keys'de ilişkili olanları siliyoruz:
    await prisma.prompt_keys.deleteMany({ where: { prompt_id: prompt.id } });

    // * Prompt key groupstan ilişkili grupları kaldırıyoruz:
    await prisma.prompt_key_groups.deleteMany({
      where: {
        id: { in: groupIds },
        prompt_keys: { none: {} },
      },
    });

    // * Prompta bağlı olan historyleri siliyoruz:
    await prisma.histories.deleteMany({ where: { prompt_id: prompt.id } });

    // * Promptu siliyoruz:
    await prisma.prompts.deleteMany({ where: { language_id: prompt.id } });
  }

  await prisma.languages.delete({ where: { id: params.id } });
  return { status: true };
});
