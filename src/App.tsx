import Webcam from "react-webcam";
import useRecognizer from "./hooks/useRecognizer";

function App() {
  const { videoRef } = useRecognizer();

  const onUserMediaError = (error: string | DOMException) => {
    console.error("Error getting user media", error);
  };

  return (
    <>
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
    </>
  );
}

export default App;
