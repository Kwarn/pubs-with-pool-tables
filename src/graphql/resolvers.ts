import prisma from "@/lib/prisma";

export const resolvers = {
  Query: {
    users: (_: undefined, __: undefined) => {
      try {
        return prisma.user.findMany();
      } catch (error) {
        console.error("Error fetching pubs:", error);
        throw new Error("Failed to fetch pubs");
      }
    },
    pubs: (_: undefined, __: undefined) => {
      try {
        return prisma.pub.findMany({
          include: { tables: true, location: true, rules: true },
        });
      } catch (error) {
        console.error("Error fetching pubs:", error);
        throw new Error("Failed to fetch pubs");
      }
    },
  },
};
