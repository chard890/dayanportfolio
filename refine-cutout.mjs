import sharp from "sharp";

const inputPath = "assets/dayanara-cutout.png";
const outputPath = "assets/dayanara-cutout-refined.png";

const source = sharp(inputPath).ensureAlpha();
const metadata = await source.metadata();

if (!metadata.width || !metadata.height) {
  throw new Error("Unable to read cutout dimensions.");
}

const { data: rgbData, info: rgbInfo } = await source
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const alphaBuffer = await sharp(inputPath)
  .ensureAlpha()
  .extractChannel("alpha")
  // Very light smoothing to reduce halos without eroding the subject.
  .blur(0.3)
  .toBuffer();

const rgbaData = Buffer.alloc(metadata.width * metadata.height * 4);

for (let src = 0, dst = 0; src < rgbData.length; src += 3, dst += 4) {
  rgbaData[dst] = rgbData[src];
  rgbaData[dst + 1] = rgbData[src + 1];
  rgbaData[dst + 2] = rgbData[src + 2];
  rgbaData[dst + 3] = alphaBuffer[dst / 4];
}

await sharp(rgbaData, {
  raw: {
    width: rgbInfo.width,
    height: rgbInfo.height,
    channels: 4,
  },
})
  .png()
  .toFile(outputPath);

console.log(`Saved refined cutout to ${outputPath}`);
