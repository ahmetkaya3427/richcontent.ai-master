import { z } from "zod";

const Schema = z.object({
  username: z.string(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, Schema.parse);

  const user = await prisma.users.findFirst({
    where: {
      username: body.username,
      password: hashPassword(body.password),
    },
  });

  if (!user) throw createError({ statusCode: 400, message: "Kullanıcı adı veya şifre yanlış." });

  const config = useRuntimeConfig();
  const { sign } = (await import("jsonwebtoken")).default;

  const expires_at = Date.now() + parseInt(config.cookieExpires);
  const token = sign({ username: user.username }, config.cookieSecret, { expiresIn: "24h" });

  await prisma.tokens.create({
    data: { token, expires_at, user_id: user.id },
  });

  setCookie(event, config.cookieName, token, {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    secure: false,
    expires: new Date(expires_at),
  });

  return { status: true };
});
