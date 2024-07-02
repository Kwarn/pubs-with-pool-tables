import prisma from "@/lib/prisma";
import { CommentInput, PubInput } from "@/types";
import { Table } from "@prisma/client";

export const resolvers = {
  Query: {
    pubs: async () => {
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
          where: { pubId: Number(pubId) },
          include: { pub: true },
        });
      } catch (error) {
        console.error("Error fetching comments:", error);
        throw new Error("Failed to fetch comments");
      }
    },
  },
  Mutation: {
    addPub: async (_: undefined, { input }: { input: PubInput }) => {
      const { name, address, createdBy, location, rules, tables } = input;

      const newPub = {
        name: name,
        address: address,
        createdBy: createdBy,
        location: {
          create: {
            lat: location.lat,
            lng: location.lng,
          },
        },
        rules: {
          create: {
            isCueDeposit: rules.isCueDeposit,
            isJumpingAllowed: rules.isJumpingAllowed,
            isPoundOnTable: rules.isPoundOnTable,
            isReservationAllowed: rules.isReservationAllowed,
          },
        },
        tables: tables
          ? {
              create: tables.map((table: Table) => ({
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
    addComment: async (_: undefined, { input }: { input: CommentInput }) => {
      try {
        const createdComment = await prisma.comment.create({
          data: {
            text: input.text,
            author: input.author,
            pubId: Number(input.pubId),
          },
          include: {
            pub: true,
          },
        });
        return createdComment;
      } catch (error) {
        console.error("Error creating comment:", error);
        throw new Error("Failed to create comment");
      }
    },
    deletePub: async (_: undefined, { id }: { id: number }) => {
      const pubId = Number(id);
      try {
        await prisma.comment.deleteMany({
          where: { pubId },
        });

        const deletedPub = await prisma.pub.delete({
          where: { id: pubId },
        });

        return deletedPub;
      } catch (error) {
        console.error("Error deleting pub:", error);
        throw new Error("Failed to delete pub");
      }
    },
  },
};
