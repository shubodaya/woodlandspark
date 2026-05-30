import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const sourceFile = "apps/foodorder/backend/scripts/initDb.js";
const sourceAssetDir = "apps/foodorder/asset";
const imageOutDir = "src/assets/images/foodorder";
const dataOutFile = "src/data/food/menuData.js";

function extractBlock(source, name) {
  const match = source.match(new RegExp(`const ${name} = [\\s\\S]*?\\n};?`, "m"));
  if (!match) throw new Error(`Could not extract ${name}`);
  return match[0];
}

function extractArrayBlock(source, name) {
  const start = source.indexOf(`const ${name} = [`);
  if (start === -1) throw new Error(`Could not extract ${name}`);
  let depth = 0;
  let end = -1;
  for (let i = source.indexOf("[", start); i < source.length; i += 1) {
    const char = source[i];
    if (char === "[") depth += 1;
    if (char === "]") depth -= 1;
    if (depth === 0) {
      end = source.indexOf(";", i);
      break;
    }
  }
  return source.slice(start, end + 1);
}

function safeAssetName(fileName) {
  return basename(fileName).replace(/[^a-zA-Z0-9._-]+/g, "-");
}

async function main() {
  const source = await readFile(sourceFile, "utf8");
  const script = [
    'const CAFE_SLUGS = ["raysdiner", "lovesgrove", "cosmiccafe"];',
    extractArrayBlock(source, "categoryDefinitions"),
    extractArrayBlock(source, "extraDefinitions"),
    'const HOT_DRINK_SYRUPS = ["Caramel Syrup", "Vanilla Syrup", "Pumpkin Syrup", "Hazelnut Syrup"];',
    'const CHIPS_EXTRAS = ["Extra Cheese", "Extra Curry", "Extra Chilli"];',
    'const KIDS_EXTRAS = ["Extra Fries", "Extra Drink", "Extra Sauce"];',
    extractArrayBlock(source, "menuDefinitions"),
    extractBlock(source, "itemAssetFileMap"),
    "return { CAFE_SLUGS, categoryDefinitions, extraDefinitions, menuDefinitions, itemAssetFileMap };",
  ].join("\n");

  const {
    CAFE_SLUGS,
    categoryDefinitions,
    extraDefinitions,
    menuDefinitions,
    itemAssetFileMap,
  } = Function(script)();

  await mkdir(imageOutDir, { recursive: true });
  const menuItems = [];
  const imageCopies = [];

  for (const item of menuDefinitions) {
    const sourceAssetName = itemAssetFileMap[item.name] || "";
    const publicAssetName = sourceAssetName ? safeAssetName(sourceAssetName) : "";
    if (sourceAssetName) {
      const sourcePath = join(sourceAssetDir, sourceAssetName);
      if (existsSync(sourcePath)) {
        await copyFile(sourcePath, join(imageOutDir, publicAssetName));
        imageCopies.push({ source: sourcePath, filename: `foodorder/${publicAssetName}`, item: item.name });
      }
    }

    menuItems.push({
      ...item,
      cafeSlugs: item.cafeSlugs || CAFE_SLUGS,
      image: publicAssetName ? `foodorder/${publicAssetName}` : "",
    });
  }

  const data = {
    generatedAt: new Date().toISOString(),
    source: sourceFile,
    cafes: [
      { slug: "raysdiner", label: "Ray's Diner" },
      { slug: "lovesgrove", label: "Loves Grove Cafe" },
      { slug: "cosmiccafe", label: "Cosmic Cafe" },
    ],
    categories: categoryDefinitions,
    extras: extraDefinitions,
    menuItems,
    imageCopies,
    note: "Copied from apps/foodorder OrderCircuit seed menu for read-only public menu browsing. Ordering and payments are disabled.",
  };

  await mkdir(dirname(dataOutFile), { recursive: true });
  await writeFile(dataOutFile, `export const foodMenuData = ${JSON.stringify(data, null, 2)};\n`, "utf8");
  console.log(`Exported ${menuItems.length} menu items and ${imageCopies.length} local images.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
