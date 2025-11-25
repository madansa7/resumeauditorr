/**
 * Waits for a library to be available on the window object.
 * This is useful for scripts loaded from a CDN.
 * @param libName The name of the library on the window object (e.g., 'pdfjsLib').
 * @param timeout The maximum time to wait in milliseconds.
 * @returns A promise that resolves with the library object.
 */
export const waitForLibrary = <T>(libName: string, timeout = 7000): Promise<T> => {
  return new Promise((resolve, reject) => {
    let intervalId: number;
    const startTime = Date.now();

    const check = () => {
      if ((window as any)[libName]) {
        clearInterval(intervalId);
        resolve((window as any)[libName] as T);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(intervalId);
        reject(new Error(`The required library '${libName}' did not load in time. This may be due to a network issue. Please refresh the page and try again.`));
      }
    };

    intervalId = window.setInterval(check, 100);
  });
};
