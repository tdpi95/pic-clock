export type ImageWorkerRequest = {
    file: Blob;
    maxSize: number;
    quality: number;
};

export type ImageWorkerResponse = {
    blob: Blob;
};

self.onmessage = async (e: MessageEvent<ImageWorkerRequest>) => {
    const { file, maxSize, quality } = e.data;

    const bitmap = await createImageBitmap(file);

    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await canvas.convertToBlob({
        type: "image/webp",
        quality,
    });

    self.postMessage({ blob });
};
