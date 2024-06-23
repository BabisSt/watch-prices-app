import "./App.css";

function App() {
  return (
    <div>
      {/* File Uploader */}
      <input
        type="file"
        name="file"
        accept=".csv"
        style={{ display: "block", margin: "10px auto" }}
      />
    </div>
  );
}

export default App;