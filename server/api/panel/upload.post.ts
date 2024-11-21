import { promises as fs } from "fs";
import path from "path";
import formidable from "formidable";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { $Enums } from "@prisma/client";

const uploadDir = path.join(process.cwd(), "/uploads");

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const user = event.context.user;

  const form = formidable({
    uploadDir,
    multiples: true,
    keepExtensions: true,
  });

  const { files, fields }: any = await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err: any, fields: any, files: any) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  if (!files.file || !Array.isArray(files.file)) {
    throw createError({
      statusCode: 400,
      statusMessage: "No file uploaded or file format incorrect",
    });
  }

  const fileUrls = await Promise.all(
    files.file.map(async (file: any) => {
      const fileExtension = path.extname(file.originalFilename);
      const filename = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadDir, filename);
      await fs.rename(file.filepath, filePath);

      const thumbnailFilename = `thumb-${uuidv4()}${fileExtension}`;
      const thumbnailPath = path.join(uploadDir, thumbnailFilename);
      await sharp(filePath).resize({ width: 200 }).toFile(thumbnailPath);

      return {
        original: `${config.public.siteUrl}uploads/${filename}`,
        thumbnail: `${config.public.siteUrl}uploads/${thumbnailFilename}`,
      };
    }),
  );

  const images = fileUrls.map((e) => e.thumbnail);
  const groupUrl = `${config.public.siteUrl}${uuidv4()}`;
  const { language, prompt_id } = fields;

  const promptEntry = await prisma.prompts.findFirst({
    where: { id: parseInt(prompt_id), language_id: language.id },
  });

  if (!promptEntry) throw createError({ statusCode: 400, message: "Internal error (1)" });

  await prisma.histories.create({
    data: {
      link: groupUrl,
      images,
      product_description: "",
      product_title: "Özel Resim",
      type: $Enums.history_type.upload,
      gpt_description: {},
      user_id: user.id,
      prompt_id: promptEntry.id,
    },
  });

  return { groupUrl, fileUrls };
});
