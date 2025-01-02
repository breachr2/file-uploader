import s3Client from "../config/s3Client";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const deleteFileFromS3 = async (filename: string) => {
  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
  };

  const command = new DeleteObjectCommand(deleteParams);
  await s3Client.send(command);
};

const updateFileFromS3 = async (
  imageName: string,
  mimetype: string,
  buffer: Buffer<ArrayBufferLike>
) => {
  const updateParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageName,
    Body: buffer,
    ContentType: mimetype,
  };

  const command = new PutObjectCommand(updateParams);
  await s3Client.send(command);
};

export { deleteFileFromS3, updateFileFromS3 };
