import { useEffect } from "react";

/**
 * Custom hook that sets a timer to delay the execution of the
 * callback, and resetting the timer each time a new event is
 * received. This is called debouncing and allows the callback
 * to only be executed after a certain amount of time has passed
 * without new events being received.
 *
 * @param {Function} callback
 * @param {Number} delay
 * @param {Array} dependencies
 */
export function useDebounce(callback, delay, dependencies) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
