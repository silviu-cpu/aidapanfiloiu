// All browser icons are generated from the exact SVG used in the navbar.
const fs = require('node:fs/promises');
const sharp = require('sharp');

async function main() {
  const source = 'public/brand/logo.svg';
  await sharp(source).resize(96, 96).png().toFile('public/brand/icon-96.png');
  await sharp(source).resize(180, 180).png().toFile('public/brand/apple-touch-icon.png');
  const sizes = [16, 32, 48, 256];
  const images = await Promise.all(sizes.map((size) => sharp(source).resize(size, size).png().toBuffer()));
  const header = Buffer.alloc(6 + sizes.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  images.forEach((data, i) => {
    const entry = 6 + i * 16;
    header[entry] = sizes[i] === 256 ? 0 : sizes[i];
    header[entry + 1] = sizes[i] === 256 ? 0 : sizes[i];
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  await fs.writeFile('public/favicon.ico', Buffer.concat([header, ...images]));
  console.log('Generated SVG-based PNG and ICO icons.');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
