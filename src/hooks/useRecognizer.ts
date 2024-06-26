import type { GestureRecognizerResult } from "@mediapipe/tasks-vision";
import { useRef, useState } from "react";
import Recognizer from "../lib/Recognizer";
import { useEffectOnce } from "./useEffectOnce";

/**
 * A custom React hook for integrating the Recognizer class into React applications.
 * Manages initialization of the Recognizer instance and provides access to inference results.
 * @returns {{
 *   results: GestureRecognizerResult | null,
 *   videoRef: React.MutableRefObject<HTMLVideoElement | undefined>
 * }} An object containing inference results and a reference to the video element.
 */
export default function useRecognizer() {
	const [error, setError] = useState<string>();
	const [results, setResults] = useState<GestureRecognizerResult | null>(null);
	const recognizerRef = useRef<Recognizer | null>(null);
	const videoRef = useRef<HTMLVideoElement>();

	/**
	 * Initializes the Recognizer instance when the video element becomes available.
	 */
	const initializeRecognizer = async () => {
		try {
			// Early return if a Recognizer instance already exists or video element is not available
			if (!videoRef.current || recognizerRef.current) return;
			const recognizer = await Recognizer.create({
				videoElement: videoRef.current,
			});
			recognizerRef.current = recognizer;

			recognizer.onResults(setResults);
		} catch {
			setError("Failed to initialize Recognizer");
			throw new Error("Failed to initialize Recognizer");
		}
	};

	useEffectOnce(initializeRecognizer);

	return { results, videoRef, recognizerRef, error };
}
