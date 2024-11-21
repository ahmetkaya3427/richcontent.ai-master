import fs from "fs/promises";
import path from "path";

const createSettings = async () => {
  console.log("Creating settings");

  const exists = await prisma.settings.findFirst();
  if (exists) {
    console.log("Settings already exists");
    return;
  }

  await prisma.settings.create({
    data: { chatgpt_api_key: "" },
  });

  console.log("Settings created");
};

const createUploadsFolder = async () => {
  const uploadDir = path.join(process.cwd(), "/uploads");
  const uploadsPath = path.resolve(uploadDir);
  try {
    await fs.access(uploadsPath);
  } catch {
    await fs.mkdir(uploadsPath, { recursive: true });
  }
};

export default defineNitroPlugin(async (_nitroApp) => {
  await createSettings();
  await createUploadsFolder();
});
