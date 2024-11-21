import { z } from "zod";

const Schema = z.object({
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string(),
  username: z.string(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, Schema.parse);
  data.password = hashPassword(data.password);

  const exists = await prisma.users.findFirst({
    where: {
      OR: [{ email: data.email }, { phone: data.phone }, { username: data.username }],
    },
  });

  if (exists) {
    if (exists.username === data.username) {
      return createError({ statusCode: 400, message: "Bu kullanıcı adı zaten kullanılıyor." });
    }

    if (exists.email === data.email) {
      return createError({ statusCode: 400, message: "Bu e-posta adresi zaten kullanılıyor." });
    }

    if (exists.phone === data.phone) {
      return createError({ statusCode: 400, message: "Bu telefon numarası zaten kullanılıyor." });
    }
  }

  const user = await prisma.users.create({ data: { ...data, credit: 5, role: "user" } });
  const config = useRuntimeConfig();
  const { sign } = (await import("jsonwebtoken")).default;

  const expires_at = Date.now() + parseInt(config.cookieExpires);
  const token = sign({ username: user.username }, config.cookieSecret, { expiresIn: "24h" });

  await prisma.tokens.create({ data: { token, expires_at, user_id: user.id } });

  setCookie(event, config.cookieName, token, {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    secure: false,
    expires: new Date(expires_at),
  });

  return { status: true };
});
