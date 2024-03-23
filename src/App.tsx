import Webcam from "react-webcam";
import useCanvas from "./hooks/useCanvas";
import useRecognizer from "./hooks/useRecognizer";

function App() {
  const { videoRef, results } = useRecognizer();
  const { canvasRef } = useCanvas(results?.landmarks);

  const onUserMediaError = (error: string | DOMException) => {
    console.error("Error getting user media", error);
  };

  return (
    <main>
      <canvas ref={canvasRef} />
      <Webcam
        ref={(webCamRef) => {
          if (webCamRef?.video) {
            videoRef.current = webCamRef.video;
          }
        }}
        audio={false}
        playsInline
        muted
        onUserMediaError={onUserMediaError}
      />
    </main>
  );
}

export default App;
