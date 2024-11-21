import { z } from "zod";

const Body = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, Body.parse);
  const oldPassword = hashPassword(data.oldPassword);
  const newPassword = hashPassword(data.newPassword);
  const userId = event.context.user.id;

  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user) throw createError({ statusCode: 400, message: "Kullanıcı bulunamadı." });
  if (user.password !== oldPassword) {
    throw createError({ statusCode: 400, message: "Eski şifrenizi doğru girin." });
  }

  await prisma.users.update({
    where: { id: userId },
    data: { password: newPassword },
  });

  return { status: true };
});
