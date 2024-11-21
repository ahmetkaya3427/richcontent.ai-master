import { $Enums } from "@prisma/client";
import { z } from "zod";

const Body = z.object({
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phone: z.string(),
  username: z.string(),
  password: z.string(),
  role: z.nativeEnum($Enums.user_role),
  credit: z.number(),
  prompt_ids: z.array(z.number()),
});

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, Body.parse);
  data.password = hashPassword(data.password);

  const user = await prisma.users.create({
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

  for (const prompt_id of data.prompt_ids) {
    await prisma.user_prompts.deleteMany({ where: { user_id: user.id } });
    await prisma.user_prompts.create({ data: { user_id: user.id, prompt_id } });
  }

  return { status: true };
});
