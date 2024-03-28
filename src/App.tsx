import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import useCanvas from "./hooks/useCanvas";
import useRecognizer from "./hooks/useRecognizer";

const emojisMap: Record<string, string> = {
	Thumb_Up: "👍",
	Thumb_Down: "👎",
	Closed_Fist: "✊",
	Open_Palm: "🖐️",
	Pointing_Up: "👆",
	Victory: "✌️",
	None: "",
};

function App() {
	const [scope, animate] = useAnimate();
	const [isMediaStreamReady, setIsMediaStreamReady] = useState(false);
	const { videoRef, results, recognizerRef, error } = useRecognizer();
	const { canvasRef } = useCanvas(results?.landmarks);
	const constraintsRef = useRef(null);

	const emojiLabel = results?.gestures[0]?.[0].categoryName ?? "None";

	const onUserMediaError = (error: string | DOMException) => {
		setIsMediaStreamReady(false);
		console.error("Error getting user media", error);
	};

	useEffect(() => {
		if (emojiLabel !== "None") {
			animate(scope.current, {
				opacity: [0, 1],
				rotate: [180, 0],
				scale: [2, 1],
				transition: { type: "spring", stiffness: 260, damping: 20, duration: 5 },
			});
		}
	}, [emojiLabel, animate, scope.current]);

	return (
		<main>
			<h1>Recognize hand gestures in the video stream based on a defined set of classes 👍 👎 ✊ 🖐️ 👆 ✌️</h1>
			<h1 className="emoji" ref={scope}>
				{emojisMap[emojiLabel]}
			</h1>
			<div className="container" ref={constraintsRef}>
				<canvas ref={canvasRef} width={400} height={300} />
				<div
					className={`${isMediaStreamReady ? "videoContainer" : ""} ${
						results?.gestures.length ? "active" : "inactive"
					}`}
				>
					<Webcam
						width={400}
						height={300}
						ref={(webCamRef) => {
							if (webCamRef?.video) {
								videoRef.current = webCamRef.video;
							}
						}}
						audio={false}
						playsInline
						muted
						onUserMedia={() => setIsMediaStreamReady(true)}
						onUserMediaError={onUserMediaError}
					/>
				</div>
			</div>
			<p>
				{error
					? "🔴 Failed to initiate recgonizer. Check your browser console and network."
					: recognizerRef.current === null
						? "🟠 Initiating recgonizer ..."
						: "🟢 Recgonizer ready"}
			</p>
			<p>{emojiLabel === "None" ? "No gesture detected 🤷" : `${emojisMap[emojiLabel]} gesture detected`}</p>
		</main>
	);
}

export default App;
