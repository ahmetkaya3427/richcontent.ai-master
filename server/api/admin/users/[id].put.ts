import { $Enums } from "@prisma/client";
import { z } from "zod";

const Params = z.object({
  id: z.string().transform(Number),
});

const Body = z.object({
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string(),
  username: z.string(),
  password: z.optional(z.string()),
  role: z.nativeEnum($Enums.user_role),
  credit: z.number(),
  prompt_ids: z.array(z.number()),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, Params.parse);
  const data = await readValidatedBody(event, Body.parse);
  const user = event.context.user;

  if (data.password) data.password = hashPassword(data.password);

  await prisma.users.update({
    where: { id: params.id },
    data: {
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      username: data.username,
      password: data.password,
      role: data.role,
      credit: data.credit,
    },
  });

  await prisma.user_prompts.deleteMany({ where: { user_id: user.id } });

  for (const prompt_id of data.prompt_ids) {
    await prisma.user_prompts.create({ data: { user_id: user.id, prompt_id } });
  }

  return { status: true };
});
