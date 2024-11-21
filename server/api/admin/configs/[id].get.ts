import { z } from "zod";

const Params = z.object({
  id: z.string().transform(Number),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, Params.parse);

  const details = await prisma.configs.findFirst({
    where: { id: params.id },
  });

  if (!details) {
    throw createError({ statusCode: 400, message: "Details not found" });
  }

  const ignore_url = details.ignore_url.join("\n");
  const ignore_xpath = details.ignore_xpath.join("\n");
  const ignore_selector = details.ignore_selector.join("\n");
  const include_url = details.include_url.join("\n");
  const include_xpath = details.include_xpath.join("\n");
  const include_selector = details.include_selector.join("\n");
  const description_xpath = details.description_xpath.join("\n");
  const description_selector = details.description_selector.join("\n");
  const code_xpath = details.code_xpath.join("\n");
  const code_selector = details.code_selector.join("\n");

  return {
    ...details,
    ignore_url,
    ignore_xpath,
    ignore_selector,
    include_url,
    include_xpath,
    include_selector,
    description_xpath,
    description_selector,
    code_xpath,
    code_selector,
  };
});
