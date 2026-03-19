import fs from "node:fs/promises";
import path from "node:path";

export async function removeLocalFile(fileUrl?: string): Promise<void> {
  if (!fileUrl) {
    return;
  }

  const relativePath = fileUrl.replace(/^\/+/, "");
  const absolutePath = path.join(process.cwd(), "public", relativePath);

  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}
