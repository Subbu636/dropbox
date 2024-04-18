import React, { useState } from "react";

const AddFolder = ({ refresh, path }) => {
  const [folderName, setfolderName] = useState("");
  const handleAddFolder = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/addFolder?path=${path}&name=${folderName}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        alert("Folder added successfully");
        refresh(path);
      } else {
        throw new Error("Add folder failed");
      }
    } catch (err) {
      alert("Failed to add folder");
      console.error(err);
    }
  };
  return (
    <div>
      <div>
        <div className="input-group input-group-sm mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Folder name"
            value={folderName}
            onChange={(e) => setfolderName(e.target.value)}
          />
          <button
            className="btn btn-secondary"
            type="button"
            id="button-addon2"
            onClick={handleAddFolder}
          >
            +Add Folder
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFolder;
