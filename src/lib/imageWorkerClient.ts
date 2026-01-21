export function compressInWorker(
    file: Blob,
    maxSize: number,
    quality: number,
): Promise<Blob> {
    return new Promise((resolve) => {
        const worker = new Worker(
            new URL("./imageWorker.ts", import.meta.url),
            { type: "module" },
        );

        worker.onmessage = (e) => {
            resolve(e.data.blob);
            worker.terminate();
        };

        worker.postMessage({ file, maxSize, quality });
    });
}
