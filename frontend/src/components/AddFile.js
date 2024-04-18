import React, { useState } from "react";

const AddFile = ({ refresh, path }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        `http://localhost:3001/addFile?path=${path}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert("File uploaded successfully");
        refresh(path);
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error uploading file");
    }
  };
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  return (
    <div>
      <div className="input-group input-group-sm">
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
    </div>
  );
};

export default AddFile;
