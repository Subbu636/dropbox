import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import "./DisplayFolder.css";
import AddFile from "./AddFile";
import AddFolder from "./AddFolder";

const DisplayFolder = () => {
  const [path, setPath] = useState("");
  const [folderItem, setFolderItem] = useState({});
  async function refreshFolder(folderPath) {
    try {
      const res = await fetch(
        `http://localhost:3001/folder?path=${folderPath}`
      );
      const newFolderItem = await res.json();
      setFolderItem(newFolderItem);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    refreshFolder(path);
  }, [path]);
  const handleDownloadFile = async (item) => {
    const filePath = item.path + "/" + item.name;
    try {
      const response = await fetch(
        `http://localhost:3001/file?path=${filePath}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      saveAs(blob, item.name);
    } catch (error) {
      alert("Failed to download file");
      console.error("Failed to download file:", error);
    }
  };
  const handleViewFile = async (item) => {
    const filePath = item.path + "/" + item.name;
    try {
      const response = await fetch(
        `http://localhost:3001/file?path=${filePath}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      const newTab = window.open(fileUrl, "_blank");
      if (newTab) {
        newTab.addEventListener("load", () => {
          window.URL.revokeObjectURL(fileUrl);
        });
      } else {
        console.error("Failed to open the new tab");
      }
    } catch (error) {
      alert("Failed to view file");
      console.error("Failed to view file", error);
    }
  };
  return (
    <>
      <div className="folder-path">
        {(folderItem.path ? "root/" + folderItem.path : "root") +
          "/" +
          folderItem.name}
      </div>
      {path && (
        <div className="folder" onClick={() => setPath(folderItem.path)}>
          📂 ..
        </div>
      )}
      {folderItem.children &&
        folderItem.children.map((item, ind) =>
          item.isFolder ? (
            <div
              key={ind}
              className="folder"
              onClick={() => setPath(item.path + "/" + item.name)}
            >
              📂 {item.name}
            </div>
          ) : (
            <div key={ind} className="file">
              <span>📄 {item.name}</span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleViewFile(item)}
              >
                View
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => handleDownloadFile(item)}
              >
                Download
              </button>
            </div>
          )
        )}
      <div className="intake">
        <AddFile refresh={refreshFolder} path={path} />
        <AddFolder refresh={refreshFolder} path={path} />
      </div>
    </>
  );
};

export default DisplayFolder;
