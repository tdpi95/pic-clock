export async function createVideoPoster(file: File): Promise<Blob> {
    return new Promise((resolve) => {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.muted = true;
        video.playsInline = true;

        video.onloadeddata = () => {
            video.currentTime = Math.min(1, video.duration / 2);
        };

        video.onseeked = () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext("2d")!.drawImage(video, 0, 0);

            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(video.src);
                    resolve(blob!);
                },
                "image/webp",
                0.7,
            );
        };
    });
}
