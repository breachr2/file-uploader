import { CloudFrontClient } from "@aws-sdk/client-cloudfront";
import "dotenv/config";

let client: CloudFrontClient;

const region = process.env.AWS_REGION || "us-west-2";

if (process.env.NODE_ENV === "DEV") {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
  client = new CloudFrontClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
} else {
  client = new CloudFrontClient({ region });
}

export default client;
