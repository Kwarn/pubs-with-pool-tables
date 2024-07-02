import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      await res.revalidate("/");

      return res.json({ revalidated: true });
    } catch (err) {
      return res.status(500).json({ error: "Failed to revalidate" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
