import { useRef } from "react";
import Webcam from "react-webcam";

function App() {
  const cameraRef = useRef<Webcam>(null);

  const onUserMediaError = (error: string | DOMException) => {
    console.error("Error getting user media", error);
  };

  return (
    <>
      <Webcam
        ref={cameraRef}
        audio={false}
        playsInline
        muted
        onUserMediaError={onUserMediaError}
      />
    </>
  );
}

export default App;
