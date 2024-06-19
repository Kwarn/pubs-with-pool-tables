import prisma from "@/lib/prisma";

export const resolvers = {
  Query: {
    users: (_: undefined, __: undefined) => {
      return prisma.user.findMany();
    },
  },
};
