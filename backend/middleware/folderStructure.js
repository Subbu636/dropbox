const fs = require("fs").promises;
const path = require("path");

module.exports = async function (folder) {
  const folderList = [];
  const entries = await fs.readdir(folder, { withFileTypes: true });
  for (const entry of entries) {
    const element = {};
    element["name"] = entry.name;
    element["isFolder"] = entry.isDirectory();
    element["path"] = folder.slice(5);
    folderList.push(element);
  }
  let fpath = folder.split("/");
  let fname = fpath.pop();
  fpath = fpath.join("/").slice(5);
  if (fpath.length === 0 && fname === "data") fname = "";
  return {
    name: fname,
    isFolder: true,
    path: fpath,
    children: folderList,
  };
};
