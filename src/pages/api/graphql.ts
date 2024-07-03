import { ApolloServer } from "apollo-server-micro";
import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import { typeDefs } from "../../graphql/schema";
import { resolvers } from "../../graphql/resolvers";

const getOrigin = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  } else {
    return "https://pubs-with-pool-tables.vercel.app";
  }
};

const cors = Cors({
  origin: getOrigin(),
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  persistedQueries: false, // Todo: resolve this for future use - quick fix for 'Persisted queries are enabled and are using an unbounded cache. Your server is vulnerable to denial of service attacks via memory exhaustion.'
});

const startServer = apolloServer.start();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await runMiddleware(req, res, cors);

    if (req.method === "OPTIONS") {
      res.end(); // Handle OPTIONS request
      return;
    }

    await startServer;
    await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
  } catch (error) {
    console.error("Error in API handler:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
