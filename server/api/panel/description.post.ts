import { z } from "zod";
import { OpenAI } from "openai";
import { $Enums } from "@prisma/client";
import { zodResponseFormat } from "openai/helpers/zod";

const Schema = z.object({
  url: z.string(),
  type: z.nativeEnum($Enums.history_type),
  recreate: z.optional(z.boolean()),
  language: z.string(),
  prompt_id: z.string().transform(Number),
});

type HistoryType = Awaited<ReturnType<typeof prisma.histories.findFirst>>;

function generateZodSchema(promptKeys: any[]) {
  const schemaFields: Record<string, any> = {};

  promptKeys.forEach((item) => {
    schemaFields[item.key] = z.string();
  });

  return z.object(schemaFields);
}

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, Schema.parse);
  const user = event.context.user;

  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });
  if (user.role === "user" && user.credit < 1) throw createError({ statusCode: 400, message: "Insufficient credit" });

  const language = await prisma.languages.findFirst({ where: { code: body.language } });
  if (!language) throw createError({ statusCode: 400, message: "Internal error (1)" });

  const prompts = await prisma.prompts.findFirst({
    where: { id: body.prompt_id, language_id: language.id },
    include: { prompt_keys: true },
  });

  if (!prompts) throw createError({ statusCode: 400, message: "Internal error (2)" });

  let history: HistoryType;

  if (body.type === $Enums.history_type.link) {
    const generalHistory = await prisma.histories.findFirst({
      where: { link: body.url, user_id: { not: user.id }, prompt_id: prompts.id },
      orderBy: { created_at: "desc" },
    });

    const userHistories = await prisma.histories.findMany({ where: { link: body.url, user_id: user.id } });

    if (!userHistories.length) {
      throw createError({ statusCode: 400, message: "Internal error (3)" });
    }

    const findHistory = userHistories.find((e) => e.prompt_id === prompts.id);

    if (findHistory) {
      if (findHistory.gpt_description && !body.recreate) {
        return { content: JSON.parse(findHistory.gpt_description as string), credit: user.credit };
      }

      history = findHistory;
    }

    if (findHistory && !findHistory.gpt_description && generalHistory?.gpt_description) {
      history = await prisma.histories.update({
        where: { user_id: user.id, id: findHistory.id },
        data: { gpt_description: generalHistory.gpt_description, updated_at: new Date() },
      });

      const updatedUser = await prisma.users.update({
        where: { id: user.id },
        data: { credit: { decrement: 1 } },
      });

      return { content: JSON.parse(generalHistory.gpt_description as string), credit: updatedUser.credit };
    }

    if (!findHistory) {
      const _history = userHistories[0];
      history = await prisma.histories.create({
        data: {
          user_id: user.id,
          link: _history.link,
          gpt_description: "",
          images: _history.images,
          prompt_id: prompts.id,
          type: $Enums.history_type.link,
          product_title: _history.product_title,
          product_description: _history.product_description,
        },
      });
    }
  }

  if (body.type === $Enums.history_type.upload) {
    history = await prisma.histories.findFirst({
      where: { link: body.url },
      orderBy: { created_at: "desc" },
    });
  }

  const settings = await prisma.settings.findFirst();
  if (!settings || !settings.chatgpt_api_key) throw createError({ statusCode: 400, message: "Internal error (4)" });

  let prompt = prompts.content;

  if (history!.product_title) {
    prompt = prompt.replace("{Başlık}", history!.product_title);
  }

  if (history!.product_description) {
    prompt = prompt.replace("{Açıklama}", history!.product_description);
  }

  const userPrompt: any = [{ type: "text", text: prompt }];
  const images = history!.images.slice(0, 7);

  for (const image of images) {
    userPrompt.push({ type: "image_url", image_url: { url: image } });
  }

  const openai = new OpenAI({ apiKey: settings.chatgpt_api_key });
  const promptKeys = prompts.prompt_keys.sort((a, b) => a.id - b.id);

  try {
    const chat = await openai.chat.completions.create({
      messages: [{ role: "user", content: userPrompt }],
      model: "gpt-4o-2024-08-06",
      max_tokens: 4000,
      response_format: zodResponseFormat(generateZodSchema(promptKeys), "response"),
    });

    const [choice] = chat.choices;
    console.log(choice.message.content);

    const jsonContent = JSON.parse(choice.message.content || "{}");

    for (const [key, value] of Object.entries(jsonContent)) {
      const find = promptKeys.find((e) => e.key === key);
      if (!find) continue;
      if (typeof value !== "string") continue;

      const formatValue = value.replaceAll("\n", "<br>");
      jsonContent[key] = { name: find.name, content: formatValue, type: find.type };
    }

    const updateDescription = await prisma.histories.update({
      where: { user_id: user.id, id: history!.id },
      data: { gpt_description: JSON.stringify(jsonContent), updated_at: new Date() },
    });

    const update = await prisma.users.update({
      where: { id: user.id },
      data: { credit: { decrement: 1 } },
    });

    return { content: JSON.parse(updateDescription.gpt_description as string), credit: update.credit };
  } catch (error) {
    console.log(error);
    throw createError({ statusCode: 400, message: "Link description error" });
  }
});
