import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  waitUntilTableExists,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const region = process.env.AWS_REGION ?? "us-east-1";
const endpoint = process.env.DYNAMODB_ENDPOINT ?? "http://localhost:8000";

export const TABLE_NAME = process.env.DYNAMODB_PRODUCTS_TABLE ?? "Products";

const ddbClient = new DynamoDBClient({
  region,
  endpoint,
  credentials: {
    accessKeyId: "dummy",
    secretAccessKey: "dummy",
  },
});

export const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

export async function ensureProductsTable(): Promise<void> {
  try {
    await ddbClient.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    return;
  } catch (error) {
    const errorName = (error as { name?: string }).name;
    if (errorName !== "ResourceNotFoundException") {
      throw error;
    }
  }

  await ddbClient.send(
    new CreateTableCommand({
      TableName: TABLE_NAME,
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    })
  );

  await waitUntilTableExists(
    {
      client: ddbClient,
      minDelay: 1,
      maxWaitTime: 30,
    },
    {
      TableName: TABLE_NAME,
    }
  );
}
