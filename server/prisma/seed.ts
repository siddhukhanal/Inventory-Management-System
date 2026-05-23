import 'dotenv/config'; // Ensures process.env.DATABASE_URL is read correctly
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 1. Replicate __dirname functionality for NodeNext / ESM modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Set up the native PostgreSQL driver connection pool
const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// 3. Instantiate the Prisma 7 driver adapter
const adapter = new PrismaPg(pool);

// 4. Pass the adapter directly into the client constructor
const prisma = new PrismaClient({ adapter });

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  // CRITICAL: We loop backwards here so we delete child tables before parent tables
  // to avoid foreign key/referential action violations.
  for (const modelName of [...modelNames].reverse()) {
    const model: any = prisma[modelName as keyof typeof prisma];
    if (model) {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } else {
      console.error(
        `Model ${modelName} not found. Please ensure the model name is correctly specified.`
      );
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  // Arranged parent tables first so child records find their relation IDs
  const orderedFileNames = [
    "users.json",
    "products.json",
    "expenses.json",
    "expenseSummary.json",
    "expenseByCategory.json",
    "salesSummary.json",
    "sales.json",
    "purchaseSummary.json",
    "purchases.json",
  ];

  await deleteAllData(orderedFileNames);

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    if (!model) {
      console.error(`No Prisma model matches the file name: ${fileName}`);
      continue;
    }

    for (const data of jsonData) {
      // If your JSON contains ISO date strings, convert them back to Date objects
      // Prisma requires real Date instances for DateTime types
      const formattedData = { ...data };
      for (const key in formattedData) {
        if (key.toLowerCase().includes('date') || key === 'timestamp') {
          formattedData[key] = new Date(formattedData[key]);
        }
      }

      await model.create({
        data: formattedData,
      });
    }

    console.log(`Seeded ${modelName} with data from ${fileName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // 5. Cleanly shut down the PostgreSQL pool so your terminal exits
    await pool.end(); 
  });