import { useEffect } from "react";

/**
 * A custom React hook to run an effect only once when the component mounts.
 * @param {Function} effect The effect function to run.
 */
export function useEffectOnce(effect: () => void) {
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		effect();
	}, []); // Empty dependency array to run the effect only once
}
