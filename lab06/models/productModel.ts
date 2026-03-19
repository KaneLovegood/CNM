import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { TABLE_NAME, ddbDocClient } from "../config/dynamodb";

export interface Product {
  id: string;
  name: string;
  price: number;
  unit_in_stock: number;
  url_image: string;
}

export async function listProducts(searchTerm?: string): Promise<Product[]> {
  const response = await ddbDocClient.send(
    new ScanCommand({
      TableName: TABLE_NAME,
    })
  );

  let products = (response.Items ?? []) as Product[];

  if (searchTerm && searchTerm.trim()) {
    const keyword = searchTerm.trim().toLowerCase();
    products = products.filter((product) =>
      product.name.toLowerCase().includes(keyword)
    );
  }

  return products.sort((a, b) => a.name.localeCompare(b.name, "vi"));
}

export async function getProductById(id: string): Promise<Product | null> {
  const response = await ddbDocClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    })
  );

  return (response.Item as Product | undefined) ?? null;
}

export async function createProduct(product: Product): Promise<void> {
  await ddbDocClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: product,
    })
  );
}

export async function updateProduct(product: Product): Promise<void> {
  await ddbDocClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: product,
    })
  );
}

export async function deleteProductById(id: string): Promise<void> {
  await ddbDocClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
    })
  );
}
