import { Prisma } from "@prisma/client";

type TokenWithUser = Prisma.usersGetPayload<{
  select: {
    id: true;
    name: true;
    surname: true;
    email: true;
    phone: true;
    username: true;
    credit: true;
    role: true;
  };
}>;

declare module "h3" {
  interface H3EventContext {
    user: TokenWithUser;
  }
}
