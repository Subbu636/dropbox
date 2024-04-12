import "./App.css";
import { useState, useEffect } from "react";
import FileList from "./components/FileList.js";
import FileUpload from "./components/FileUpload.js";

function App() {
  const [filesList, setFilesList] = useState([]);
  const refreshFilesList = async () => {
    try {
      const fetchData = await fetch("http://localhost:3001/files");
      const fetchedFiles = await fetchData.json();
      setFilesList(fetchedFiles);
    } catch (error) {
      alert("Failed to get files list");
      console.error("Failed to get files:", error);
    }
  };
  useEffect(() => {
    refreshFilesList();
  }, []);
  return (
    <div className="App">
      <h2>Dropbox Clone App</h2>
      <FileList filesList={filesList} />
      <FileUpload refreshFilesList={refreshFilesList} filesList={filesList} />
    </div>
  );
}

export default App;
