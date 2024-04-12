const path = require("path");
const fs = require("fs");

module.exports = function (originalPath, originalName) {
  let counter = 1;
  let filename = originalName;
  let filePath = path.join(originalPath, filename);
  while (fs.existsSync(filePath)) {
    const fileExt = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, fileExt);
    filename = `${nameWithoutExt}${counter}${fileExt}`;
    filePath = path.join(originalPath, filename);
    counter++;
  }
  return filename;
};
