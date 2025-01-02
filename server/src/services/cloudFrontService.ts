import { CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import cloudFrontClient from "../config/cloudFrontClient";

const getSignedCloudFrontUrl = (filename: string, expiresDate: Date) => {
  const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY || "";
  const keyPairId = process.env.KEY_PAIR_ID || "";

  const signedUrl = getSignedUrl({
    url: `${process.env.CLOUDFRONT_URL}/${filename}`,
    dateLessThan: expiresDate.toISOString(),
    privateKey: privateKey,
    keyPairId: keyPairId,
  });

  return signedUrl;
};

const invalidateCloudFrontCache = async (filename: string) => {
  const invalidationParams = {
    DistributionId: process.env.DISTRIBUTION_ID,
    InvalidationBatch: {
      Paths: {
        Quantity: 1,
        Items: ["/" + filename],
      },
      CallerReference: filename,
    },
  };

  const invalidationCommand = new CreateInvalidationCommand(invalidationParams);
  await cloudFrontClient.send(invalidationCommand);
};

export { getSignedCloudFrontUrl, invalidateCloudFrontCache };
