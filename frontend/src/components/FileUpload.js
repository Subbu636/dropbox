import React, { useState } from "react";

const FileUpload = ({ refreshFilesList }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully");
        refreshFilesList();
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error uploading file");
    }
  };

  return (
    <>
      <h1 className="display-6">Upload Files</h1>
      <div className="input-group">
        <input
          type="file"
          className="form-control"
          id="inputGroupFile04"
          aria-describedby="inputGroupFileAddon04"
          aria-label="Upload"
          onChange={handleFileChange}
        />
        <button
          className="btn btn btn-primary"
          type="button"
          id="inputGroupFileAddon04"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>
    </>
  );
};

export default FileUpload;
