const fs = require("fs");
const sharp = require("sharp");
const path = require("path");

const dir = __dirname;

fs.readdirSync(dir).forEach(file => {
  if (file.match(/\.(jpg|jpeg|png)$/i)) {

    const input = path.join(dir, file);
    const output = path.join(
      dir,
      file.replace(/\.(jpg|jpeg|png)$/i, ".webp")
    );

    sharp(input)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(output)
      .then(() => console.log("Convertido:", file))
      .catch(err => console.error(err));
  }
});