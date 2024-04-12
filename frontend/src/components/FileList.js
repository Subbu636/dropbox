import { saveAs } from "file-saver";
import "./FileList.css";

const FileList = ({ filesList }) => {
  const handleViewFile = async (fileName) => {
    try {
      const response = await fetch(`http://localhost:3001/files/${fileName}`);
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
      console.error("Failed to view file:", error);
    }
  };

  const handleDownloadFile = async (fileName) => {
    try {
      const response = await fetch(`http://localhost:3001/files/${fileName}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      saveAs(blob, fileName);
    } catch (error) {
      alert("Failed to download file");
      console.error("Failed to download file:", error);
    }
  };

  return (
    <>
      <h1 className="display-6">File List</h1>
      <div className="files-list">
        {filesList.map((val, ind) => (
          <div key={ind} className="files">
            <span>{`${ind + 1}. ${val}`}</span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleViewFile(val)}
            >
              View
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleDownloadFile(val)}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default FileList;
