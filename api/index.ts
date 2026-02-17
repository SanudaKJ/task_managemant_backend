// api/index.ts
import serverless from "serverless-http";
import app from "../src/app";
import { connectDB } from "../src/db";

const serverlessHandler = serverless(app);

export const handler = async (req: any, res: any) => {
  await connectDB();
  return serverlessHandler(req, res);
};
