import prisma from "@/lib/prisma";
import { CommentInput, PubInput, Table, UserInput } from "@/types";

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
    comments: async (_: undefined, { pubId }: { pubId: string }) => {
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
    users: async () => {
      try {
        return await prisma.user.findMany();
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },
    admin: async (_: undefined, { userId }: { userId: string }) => {
      try {
        const admin = await prisma.admin.findUnique({
          where: { userId: Number(userId) },
        });
        return admin || null;
      } catch (error) {
        console.error(`Error fetching admin: ${error}`);
        throw new Error("Failed to fetch admin");
      }
    },
    admins: async () => {
      try {
        const admins = await prisma.admin.findMany();
        return admins;
      } catch (error) {
        console.error(`Error fetching admins: ${error}`);
        throw new Error("Failed to fetch admins");
      }
    },
  },
  Mutation: {
    addPub: async (_: undefined, { input }: { input: PubInput }) => {
      const {
        name,
        address,
        createdBy,
        location,
        rules,
        tables,
        isRequiresManualReview,
        pubInformation,
      } = input;

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
        isRequiresManualReview,
        pubInformation: pubInformation
          ? {
              create: {
                numberOfTables: pubInformation.numberOfTables,
                tableQuality: pubInformation.tableQuality,
                tableCost: pubInformation.tableCost,
                cueQuality: pubInformation.cueQuality,
                hasChalk: pubInformation.hasChalk,
                wheelchairAccess: pubInformation.wheelchairAccess,
                kidsFriendly: pubInformation.kidsFriendly,
              },
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
            pubInformation: true,
          },
        });
        return createdPub;
      } catch (error) {
        console.error("Error creating pub:", error);
        throw new Error("Failed to create pub");
      }
    },
    deletePub: async (_: undefined, { id }: { id: string }) => {
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
    approvePub: async (_: undefined, { id }: { id: string }) => {
      try {
        const updatedPub = await prisma.pub.update({
          where: { id: Number(id) },
          data: {
            isRequiresManualReview: false,
          },
          include: {
            tables: true,
            location: true,
            rules: true,
            comments: true,
          },
        });

        return updatedPub;
      } catch (error) {
        console.error("Error approving pub:", error);
        throw new Error("Failed to approve pub");
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
    addUser: async (_: undefined, { input }: { input: UserInput }) => {
      const { email, name } = input;

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          return existingUser;
        }

        const newUser = await prisma.user.create({
          data: {
            email,
            name,
          },
        });

        return newUser;
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
      }
    },
    addAdmin: async (_: undefined, { userId }: { userId: string }) => {
      const id = Number(userId);
      try {
        const existingAdmin = await prisma.admin.findUnique({
          where: { userId: id },
        });

        if (existingAdmin) {
          throw new Error("User is already an admin");
        }

        const admin = await prisma.admin.create({
          data: {
            userId: Number(userId),
          },
        });

        return admin;
      } catch (error) {
        throw new Error(`Failed to add admin: ${error}`);
      }
    },
    removeAdmin: async (_: undefined, { userId }: { userId: string }) => {
      const id = Number(userId);
      try {
        const admin = await prisma.admin.findUnique({
          where: { userId: Number(userId) },
        });

        if (!admin) {
          throw new Error("User is not an admin");
        }

        await prisma.admin.delete({
          where: { userId: id },
        });

        return admin;
      } catch (error) {
        throw new Error(`Failed to remove admin: ${error}`);
      }
    },
  },
};
