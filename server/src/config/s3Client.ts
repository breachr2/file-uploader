import { S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

let s3Client: S3Client;

const region = process.env.AWS_REGION || "us-west-2";

if (process.env.NODE_ENV === "DEV") {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
  s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
} else {
  s3Client = new S3Client({ region });
}

export default s3Client;
