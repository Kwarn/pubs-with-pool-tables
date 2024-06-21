import prisma from "@/lib/prisma";
import { PubInput } from "@/types";

export const resolvers = {
  Query: {
    pubs: async (_: undefined, __: undefined) => {
      try {
        return await prisma.pub.findMany({
          include: { tables: true, location: true, rules: true },
        });
      } catch (error) {
        console.error("Error fetching pubs:", error);
        throw new Error("Failed to fetch pubs");
      }
    },
  },
  Mutation: {
    addPub: async (_: undefined, { input }: { input: PubInput }) => {
      const newPub = {
        ...input,
        location: {
          create: {
            lat: input.location.lat,
            lng: input.location.lng,
          },
        },
        rules: {
          create: {
            isCueDeposit: input.rules.isCueDeposit,
            isJumpingAllowed: input.rules.isJumpingAllowed,
            isPoundOnTable: input.rules.isPoundOnTable,
            isReservationAllowed: input.rules.isReservationAllowed,
          },
        },
        tables: input.tables
          ? {
              create: input.tables.map((table) => ({
                size: table.size,
                quality: table.quality,
                cost: table.cost,
                description: table.description,
              })),
            }
          : undefined,
      };

      try {
        const createdPub = await prisma.pub.create({
          data: newPub,
          include: {
            location: true,
            rules: true,
            tables: true,
          },
        });
        return createdPub;
      } catch (error) {
        console.error("Error creating pub:", error);
        throw new Error("Failed to create pub");
      }
    },
  },
};
