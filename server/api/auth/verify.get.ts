export default defineEventHandler((event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  return event.context.user;
});
