const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.table.deleteMany({});
    console.log("Deleted table table data");
    await prisma.pub.deleteMany({});
    console.log("Deleted pub table data");
    await prisma.rules.deleteMany({});
    console.log("Deleted rules table data");
    await prisma.comment.deleteMany({});
    console.log("Deleted comment table data");
  } catch (error) {
    console.error("Error executing seed script:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }

  try {
    const pub1 = await prisma.pub.create({
      data: {
        name: "Pub 1 by User 1",
        address: "Area 1",
        description: "First pub created by User 1",
        location: {
          create: {
            lat: 51.5074,
            lng: -0.1278,
          },
        },
        rules: {
          create: {
            isCueDeposit: "Yes",
            isJumpingAllowed: "Yes",
            isPoundOnTable: "No",
            isReservationAllowed: "Don't Know",
          },
        },
        createdBy: "Karl Warner",
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
        comments: {
          create: [
            {
              text: "Great pub!",
              author: "Alice",
            },
            {
              text: "Nice tables and friendly staff.",
              author: "Bob",
            },
          ],
        },
      },
      include: {
        tables: true,
        comments: true,
      },
    });

    const pub2 = await prisma.pub.create({
      data: {
        name: "Pub 1 by User 2",
        address: "Area 1",
        description: "First pub created by User 2",
        location: {
          create: {
            lat: 51.5074,
            lng: -0.1278,
          },
        },
        rules: {
          create: {
            isCueDeposit: "Yes",
            isJumpingAllowed: "Yes",
            isPoundOnTable: "No",
            isReservationAllowed: "Don't Know",
          },
        },
        createdBy: "Karl Warner",
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
        comments: {
          create: [
            {
              text: "Lovely ambiance!",
              author: "Charlie",
            },
            {
              text: "Great drinks and music.",
              author: "Dave",
            },
            {
              text: "Would visit again.",
              author: "Eve",
            },
          ],
        },
      },
      include: {
        tables: true,
        comments: true,
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
