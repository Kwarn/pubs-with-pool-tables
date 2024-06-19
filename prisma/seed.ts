const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.table.deleteMany({});
    console.log("delete table table");
    await prisma.pub.deleteMany({});
    console.log("delete pub table");
    await prisma.rules.deleteMany({});
    console.log("delete rules table");
    await prisma.user.deleteMany({});
    console.log("delete user table");
  } catch (error) {
    console.error("Error executing seed script:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
  try {
    // Create users
    const user1 = await prisma.user.create({
      data: {
        name: "User 1",
        email: "user1@example.com",
      },
    });

    const user2 = await prisma.user.create({
      data: {
        name: "User 2",
        email: "user2@example.com",
      },
    });

    // Create pubs for user1
    const pub1 = await prisma.pub.create({
      data: {
        name: "Pub 1 by User 1",
        area: "Area 1",
        description: "First pub created by User 1",
        location: {
          create: {
            lat: 51.5074,
            lng: -0.1278,
          },
        },
        rules: {
          create: {
            isCueDeposit: true,
            isJumpingAllowed: false,
            isPoundOnTable: true,
            isReservationAllowed: true,
          },
        },
        createdBy: {
          connect: {
            id: user1.id,
          },
        },
        tables: {
          create: [
            {
              size: "Large",
              quality: "Good",
              cost: 10.5,
              description: "Large table in Pub 1",
            },
            {
              size: "Medium",
              quality: "Fair",
              cost: 5.0,
              description: "Medium table in Pub 1",
            },
          ],
        },
      },
      include: {
        tables: true,
      },
    });

    // Create pubs for user2
    const pub2 = await prisma.pub.create({
      data: {
        name: "Pub 1 by User 2",
        area: "Area 1",
        description: "First pub created by User 2",
        location: {
          create: {
            lat: 51.5074,
            lng: -0.1278,
          },
        },
        rules: {
          create: {
            isCueDeposit: false,
            isJumpingAllowed: true,
            isPoundOnTable: true,
            isReservationAllowed: false,
          },
        },
        createdBy: {
          connect: {
            id: user2.id,
          },
        },
        tables: {
          create: [
            {
              size: "Small",
              quality: "Good",
              cost: 8.0,
              description: "Small table in Pub 2",
            },
            {
              size: "Medium",
              quality: "Excellent",
              cost: 12.0,
              description: "Medium table in Pub 2",
            },
          ],
        },
      },
      include: {
        tables: true,
      },
    });

    console.log("Seed script executed successfully!");
  } catch (error) {
    console.error("Error executing seed script:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Unexpected error during script execution:", error);
  process.exit(1);
});
