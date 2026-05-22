import CameraView from "./components/CameraView";

function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#111",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CameraView />
    </div>
  );
}

export default App;
