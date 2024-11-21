import axios from "axios";
import { z } from "zod";
import { $Enums } from "@prisma/client";

const Schema = z.object({
  url: z.string(),
  language: z.string(),
  prompt_id: z.string().transform(Number),
});

interface GetImagesResponse {
  id?: number;
  link: string;
  product_title: string;
  images: Array<string>;
  type: $Enums.history_type;
  gpt_description: object;
  product_description: string;
  loading: boolean;
  product_code: string;
  product_sku: string;
  prompt_id: number;
}

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, Schema.parse);
  const user = event.context.user;
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

  const url = body.url.startsWith("https") || body.url.startsWith("http") ? body.url : `https://${body.url}`;
  const parseUrl = new URL(url);

  let hostname = parseUrl.hostname;
  if (hostname.startsWith("www.")) hostname = hostname.slice(4);

  const language = await prisma.languages.findFirst({ where: { code: body.language } });
  if (!language) throw createError({ statusCode: 400, statusMessage: "Internal error (1)" });

  const prompt = await prisma.prompts.findFirst({
    where: { id: body.prompt_id, language_id: language.id },
  });

  if (!prompt) throw createError({ statusCode: 400, message: "Internal error (2)" });

  const existsHistory = await prisma.histories.findFirst({
    where: { link: body.url, prompt_id: body.prompt_id },
  });

  if (existsHistory) {
    const userHistory = await prisma.histories.findFirst({
      where: { link: body.url, user_id: user.id, prompt_id: prompt.id },
      orderBy: { created_at: "desc" },
    });

    const response = {
      id: userHistory?.id,
      link: body.url,
      type: $Enums.history_type.link,
      product_title: existsHistory.product_title,
      images: existsHistory.images,
      loading: false,
      gpt_description: {},
      product_description: existsHistory.product_description,
      product_code: existsHistory.product_code,
      product_sku: existsHistory.product_sku,
      prompt_id: existsHistory.prompt_id,
    } as GetImagesResponse;

    if (userHistory) return response;

    const createHistory = await prisma.histories.create({
      data: {
        gpt_description: "",
        user_id: user.id,
        prompt_id: prompt.id,
        link: existsHistory.link,
        type: existsHistory.type,
        images: existsHistory.images,
        product_sku: existsHistory.product_sku,
        product_code: existsHistory.product_code,
        product_title: existsHistory.product_title,
        product_description: existsHistory.product_description,
      },
    });

    response.id = createHistory.id;
    return response;
  }

  const config = await prisma.configs.findFirst({ where: { domain: hostname } });
  if (!config) {
    throw createError({
      statusCode: 400,
      message: `${parseUrl.hostname} linkinden görsel çekemezsiniz. Lütfen admin ile iletişime geçin.`,
    });
  }

  const extensions = config.extensions as Array<Record<string, any>>;
  const data = {
    url,
    minSize: config.min_size,
    maxSize: config.max_size,
    minWidth: config.min_width,
    maxWidth: config.max_width,
    minHeight: config.min_height,
    maxHeight: config.max_height,
    extensions: extensions.map((e) => e.name),
    include: {
      xpath: config.include_xpath,
      selector: config.include_selector,
      url: config.include_url,
    },
    ignore: {
      xpath: config.ignore_xpath,
      selector: config.ignore_selector,
      url: config.ignore_url,
    },
    description: {
      xpath: config.description_xpath,
      selector: config.description_selector,
    },
    code: {
      xpath: config.code_xpath,
      selector: config.code_selector,
    },
    token: "5376b9327bff3588c86a19b47f1c17937ecb9df0",
  };

  const response = await axios({
    url: process.env.SERVER_URL,
    method: "POST",
    data: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.data.title || !response.data.images || !response.data.images.length) {
    throw createError({ statusCode: 400, message: "Internal error (3)" });
  }

  const create = await prisma.histories.create({
    data: {
      link: response.data.url,
      images: response.data.images,
      product_title: response.data.title,
      product_description: response.data.description.trim() || "",
      type: $Enums.history_type.link,
      gpt_description: "",
      user_id: user.id,
      prompt_id: prompt.id,
      product_code: response.data.code,
      product_sku: response.data.extra?.sku || "",
    },
    select: {
      id: true,
      link: true,
      type: true,
      images: true,
      product_code: true,
      product_title: true,
      gpt_description: true,
      product_description: true,
      product_sku: true,
      prompt_id: true,
    },
  });

  return { ...create, loading: false } as GetImagesResponse;
});
