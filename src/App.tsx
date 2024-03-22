import { GestureRecognizer } from "@mediapipe/tasks-vision";
import { useEffect } from "react";
import Webcam from "react-webcam";
import useCanvas from "./hooks/useCanvas";
import useRecognizer from "./hooks/useRecognizer";

function App() {
  const { videoRef, results } = useRecognizer();
  const { canvasRef, drawingUtils } = useCanvas();

  const onUserMediaError = (error: string | DOMException) => {
    console.error("Error getting user media", error);
  };

  useEffect(() => {
    if (canvasRef.current && drawingUtils && results) {
      const canvasContext = canvasRef.current.getContext("2d");

      if (canvasContext) {
        canvasContext.save();
        canvasContext.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        );
        canvasContext.restore();

        if (results?.landmarks) {
          for (const landmarks of results.landmarks) {
            drawingUtils.drawConnectors(
              landmarks,
              GestureRecognizer.HAND_CONNECTIONS,
              {
                color: "#12B886",
                lineWidth: 2,
              },
            );
            drawingUtils.drawLandmarks(landmarks, {
              color: "#12B886",
              radius: 3,
            });
            drawingUtils.drawLandmarks(landmarks, {
              color: "#94D82D",
              radius: 1,
            });
          }
        }
      }
    }
  }, [results, drawingUtils, canvasRef]);

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
