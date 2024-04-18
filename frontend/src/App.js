import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DisplayFolder from "./components/DisplayFolder.js";

function App() {
  return (
    <div className="App">
      <h1 className="display-6">Dropbox Clone App</h1>
      <div className="folder-data-holder">
        <DisplayFolder />
      </div>
    </div>
  );
}

export default App;
