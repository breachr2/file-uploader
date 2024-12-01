import { CloudFrontClient } from "@aws-sdk/client-cloudfront";
import "dotenv/config";

const region = process.env.AWS_REGION || "us-west-2";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";

const client = new CloudFrontClient({
  region: region,
  credentials: { accessKeyId: accessKeyId, secretAccessKey: secretAccessKey },
});

export default client;
