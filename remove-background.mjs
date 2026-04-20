import { writeFile } from "node:fs/promises";
import { removeBackground } from "@imgly/background-removal-node";

const inputPath = new URL("./assets/dayanara-profile.png", import.meta.url);
const outputPath = new URL("./assets/dayanara-cutout.png", import.meta.url);

const blob = await removeBackground(inputPath);
const arrayBuffer = await blob.arrayBuffer();

await writeFile(outputPath, Buffer.from(arrayBuffer));

console.log("Saved transparent cutout to assets/dayanara-cutout.png");
