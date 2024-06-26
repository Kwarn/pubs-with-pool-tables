import prisma from "@/lib/prisma";
import { PubInput, CommentInput } from "@/types";

export const resolvers = {
  Query: {
    pubs: async (_: undefined, __: undefined) => {
      try {
        return await prisma.pub.findMany({
          include: {
            tables: true,
            location: true,
            rules: true,
            comments: true,
          },
        });
      } catch (error) {
        console.error("Error fetching pubs:", error);
        throw new Error("Failed to fetch pubs");
      }
    },
    comments: async (_: undefined, { pubId }: { pubId: number }) => {
      try {
        return await prisma.comment.findMany({
          where: { pubId },
        });
      } catch (error) {
        console.error("Error fetching comments:", error);
        throw new Error("Failed to fetch comments");
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
            comments: true,
          },
        });
        return createdPub;
      } catch (error) {
        console.error("Error creating pub:", error);
        throw new Error("Failed to create pub");
      }
    },
    addComment: async (_: undefined, { input }: { input: CommentInput }) => {
      try {
        const createdComment = await prisma.comment.create({
          data: {
            text: input.text,
            author: input.author,
            pubId: input.pubId,
          },
        });
        return createdComment;
      } catch (error) {
        console.error("Error creating comment:", error);
        throw new Error("Failed to create comment");
      }
    },
  },
};
