export async function compressImage(
    file: Blob,
    maxSize = 1920,
    quality = 0.85,
): Promise<Blob> {
    const bitmap = await createImageBitmap(file);

    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);

    return new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/webp", quality),
    );
}

export function createThumbnail(file: Blob): Promise<Blob> {
    return compressImage(file, 300, 0.7);
}
