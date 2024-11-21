export default defineEventHandler(async () => {
  const settings = await prisma.settings.findFirst();
  if (!settings) throw createError({ statusCode: 400, message: "Settings not found" });
  return settings;
});
