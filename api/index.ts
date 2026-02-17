import serverless from "serverless-http";
import app from "../src/app";
import { connectDB } from "../src/db";

const handler = serverless(app);

export default async function (req: any, res: any) {
  await connectDB();
  return handler(req, res);
}
