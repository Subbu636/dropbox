import { saveAs } from "file-saver";

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
      <h3>My File List</h3>
      {filesList.map((val, ind) => (
        <div key={ind}>
          <span>{`${ind + 1} ${val}`}</span>
          <button onClick={() => handleViewFile(val)}>View</button>
          <button onClick={() => handleDownloadFile(val)}>Download</button>
        </div>
      ))}
    </>
  );
};

export default FileList;
