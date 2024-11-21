import { z } from "zod";

const Body = z.object({
  name: z.string().min(1),
  domain: z.string(),
  min_width: z.number(),
  max_width: z.number(),
  min_height: z.number(),
  max_height: z.number(),
  min_size: z.number(),
  max_size: z.number(),
  prompt: z.string(),
  include_url: z.string(),
  include_xpath: z.string(),
  include_selector: z.string(),
  ignore_url: z.string(),
  ignore_xpath: z.string(),
  ignore_selector: z.string(),
  extensions: z.array(z.string()),
  description_xpath: z.string(),
  description_selector: z.string(),
  code_xpath: z.string(),
  code_selector: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, Body.parse);

  const ignore_url = body.ignore_url.split("\n").filter((e) => e);
  const ignore_xpath = body.ignore_xpath.split("\n").filter((e) => e);
  const ignore_selector = body.ignore_selector.split("\n").filter((e) => e);
  const include_url = body.include_url.split("\n").filter((e) => e);
  const include_xpath = body.include_xpath.split("\n").filter((e) => e);
  const include_selector = body.include_selector.split("\n").filter((e) => e);
  const description_xpath = body.description_xpath.split("\n").filter((e) => e);
  const description_selector = body.description_selector.split("\n").filter((e) => e);
  const code_xpath = body.code_xpath.split("\n").filter((e) => e);
  const code_selector = body.code_selector.split("\n").filter((e) => e);

  await prisma.configs.create({
    data: {
      ...body,
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
    },
  });

  return { status: true };
});
