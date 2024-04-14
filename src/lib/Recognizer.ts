import {
	GestureRecognizer,
	type GestureRecognizerOptions,
	type GestureRecognizerResult,
} from "@mediapipe/tasks-vision";
import type { WasmFileset } from "./types";

/**
 * Represents a gesture recognizer that can recognize hand gestures in a video stream.
 */
export default class Recognizer {
	/**
	 * The underlying GestureRecognizer instance.
	 */
	private recognizer: GestureRecognizer | null = null;

	/**
	 * The WasmFileset used for vision tasks.
	 */
	private vision: WasmFileset;

	/**
	 * The options for the gesture recognizer.
	 */
	private options: GestureRecognizerOptions;

	/**
	 * The HTML video element used for recognition.
	 */
	private videoElement: HTMLVideoElement;

	/**
	 * The results of the gesture recognition.
	 */
	private results: GestureRecognizerResult | null = null;

	/**
	 * The callback function to be called when new results are available.
	 */
	private resultsCallback: ((results: GestureRecognizerResult | null) => void) | null = null;

	/**
	 * Creates a new instance of the Recognizer class.
	 * @param videoElement The HTML video element to be used for recognition.
	 * @param vision The WasmFileset used for vision tasks.
	 * @param options The options for the gesture recognizer.
	 */
	private constructor(videoElement: HTMLVideoElement, vision: WasmFileset, options: GestureRecognizerOptions) {
		this.vision = vision;
		this.options = options;
		this.videoElement = videoElement;
	}

	/**
	 * Creates a new instance of the Recognizer class.
	 * @param videoElement The HTML video element to be used for recognition.
	 * @param vision The WasmFileset used for vision tasks. If not provided, it will be loaded from a CDN.
	 * @param options The options for the gesture recognizer. If not provided, default options will be used.
	 * @returns A Promise that resolves to a Recognizer instance.
	 */
	static async create({
		videoElement,
		vision,
		options,
	}: {
		videoElement: HTMLVideoElement;
		vision?: WasmFileset;
		options?: GestureRecognizerOptions;
	}): Promise<Recognizer> {
		/**
		 * Manually create the WasmFileset instead of using the FilesetResolver.
		 */
		const modelAsset = await fetch(
			"https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
		);
		const wasmLoader = await fetch(
			"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm/vision_wasm_internal.js",
		);
		const wasmBinary = await fetch(
			"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm/vision_wasm_internal.wasm",
		);

		const defaultOptions: GestureRecognizerOptions = {
			runningMode: "VIDEO",
			baseOptions: {
				// Pretrained model for gesture recognition.
				// https://developers.google.com/mediapipe/solutions/vision/gesture_recognizer#models
				modelAssetBuffer: new Uint8Array(await modelAsset.arrayBuffer()),
				delegate: "GPU",
			},
			numHands: 1,
		};

		const defaultWasmFileset: WasmFileset = {
			wasmLoaderPath: URL.createObjectURL(await wasmLoader.blob()),
			wasmBinaryPath: URL.createObjectURL(await wasmBinary.blob()),
		};

		const recognizerVision = vision || defaultWasmFileset;

		const recognizerOptions = options || defaultOptions;

		const recognizer = new Recognizer(videoElement, recognizerVision, recognizerOptions);
		await recognizer.init();
		return recognizer;
	}

	/**
	 * Initializes the gesture recognizer and starts recognizing gestures from the video stream.
	 * @returns A Promise that resolves when the initialization is complete.
	 */
	private async init(): Promise<void> {
		this.recognizer = await GestureRecognizer.createFromOptions(this.vision, this.options);

		if (this.videoElement.duration) {
			const updateResults = async () => {
				if (this.recognizer) {
					this.results = await this.recognizer.recognizeForVideo(this.videoElement, Date.now());
					if (this.resultsCallback) {
						this.resultsCallback(this.results);
					}
				}
				requestAnimationFrame(updateResults);
			};

			updateResults();
		}
	}

	/**
	 * Sets a callback function to be called when new results are available.
	 * @param callback The callback function to be called with the results.
	 */
	onResults(callback: (results: GestureRecognizerResult | null) => void): void {
		this.resultsCallback = callback;
	}
}
