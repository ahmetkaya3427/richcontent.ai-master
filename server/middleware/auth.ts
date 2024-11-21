export default defineEventHandler(async (event) => {
  const { pathname } = getRequestURL(event);

  if (
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/panel") ||
    pathname.startsWith("/api/auth/verify")
  ) {
    const config = useRuntimeConfig();

    const tokenCookie = parseCookies(event).token || null;
    if (!tokenCookie) throw createError({ statusCode: 401, message: "Unauthorized" });

    const token = await prisma.tokens.findFirst({
      where: { token: tokenCookie },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            phone: true,
            username: true,
            credit: true,
            role: true,
          },
        },
      },
    });

    if (!token) {
      setCookie(event, config.cookieName, "", {
        httpOnly: false,
        path: "/",
        sameSite: "lax",
        secure: false,
        expires: new Date(0),
      });

      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    const { verify } = (await import("jsonwebtoken")).default;

    try {
      verify(token.token, config.cookieSecret);
      event.context.user = token.user;

      if (pathname.startsWith("/api/admin") && token.user.role !== "admin") {
        throw createError({ statusCode: 400, message: "Unauthorized" });
      }
    } catch (error) {
      setCookie(event, config.cookieName, "", {
        httpOnly: false,
        path: "/",
        sameSite: "lax",
        secure: false,
        expires: new Date(0),
      });

      await prisma.tokens.delete({ where: { id: token.id } });
      throw createError({ statusCode: 401, message: "Invalid token" });
    }
  }
});
