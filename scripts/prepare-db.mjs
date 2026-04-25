import { mkdir, open } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const databasePath = resolve("prisma/dev.db");

await mkdir(dirname(databasePath), { recursive: true });

const handle = await open(databasePath, "a");
await handle.close();
