import axios from "axios";
import { z } from "zod";

const Body = z.object({
  url: z.string(),
  min_width: z.number(),
  max_width: z.number(),
  min_height: z.number(),
  max_height: z.number(),
  min_size: z.number(),
  max_size: z.number(),
  include_url: z.string(),
  include_xpath: z.string(),
  include_selector: z.string(),
  ignore_url: z.string(),
  ignore_xpath: z.string(),
  ignore_selector: z.string(),
  extensions: z.array(z.object({ name: z.string() })),
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

  const response = await axios({
    url: process.env.SERVER_URL,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      url: body.url,
      minSize: body.min_size,
      maxSize: body.max_size,
      minWidth: body.min_width,
      maxWidth: body.max_width,
      minHeight: body.min_height,
      maxHeight: body.max_height,
      extensions: body.extensions.map((e) => e.name),
      include: {
        xpath: include_xpath,
        selector: include_selector,
        url: include_url,
      },
      ignore: {
        xpath: ignore_xpath,
        selector: ignore_selector,
        url: ignore_url,
      },
      description: {
        xpath: description_xpath,
        selector: description_selector,
      },
      code: {
        xpath: code_xpath,
        selector: code_selector,
      },
      token: "5376b9327bff3588c86a19b47f1c17937ecb9df0",
    }),
  });

  return response.data;
});
