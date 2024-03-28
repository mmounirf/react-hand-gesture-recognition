import { FilesetResolver, type GestureRecognizerOptions } from "@mediapipe/tasks-vision";

/**
 * Default options for the gesture recognizer.
 */
const defaultOptions: GestureRecognizerOptions = {
	runningMode: "VIDEO",
	baseOptions: {
		// Pretrained model for gesture recognition.
		// https://developers.google.com/mediapipe/solutions/vision/gesture_recognizer#models
		modelAssetPath:
			"https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
		delegate: "GPU",
	},
	numHands: 1,
};

/**
 * Default WebAssembly fileset required for MediaPipe Task APIs.
 * https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm
 */
const defaultWasmFileset = await FilesetResolver.forVisionTasks(
	"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
);

export { defaultOptions, defaultWasmFileset };
