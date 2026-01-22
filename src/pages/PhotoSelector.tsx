import * as React from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useImageStore } from "@/hooks/useImageStore";

const MAX_IMAGES = 60;

export interface PhotoSelectorProps {
    onClose?: () => void;
}

type Photo = {
    id: string;
    thumbUrl: string;
};

export default function PhotoSelector({ onClose }: PhotoSelectorProps) {
    const photoStore = useImageStore("photos");
    const [photos, setPhotos] = React.useState<Photo[]>([]);

    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        let urls: string[] = [];

        async function load() {
            const ids = await photoStore.getAllKeys();

            const items = await Promise.all(
                ids.map(async (id) => {
                    const thumbUrl = await photoStore.getThumbnailURL(id);
                    if (!thumbUrl) return null;
                    urls.push(thumbUrl);
                    return { id, thumbUrl };
                }),
            );

            setPhotos(items.filter(Boolean) as Photo[]);
        }

        load();

        return () => {
            // prevent memory leaks
            urls.forEach(URL.revokeObjectURL);
        };
    }, [photoStore]);

    const handleAddClick = () => {
        fileInputRef.current?.click();
    };

    const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;

        const remaining = MAX_IMAGES - photos.length;
        const selected = files.slice(0, remaining);

        for (const file of selected) {
            const id = crypto.randomUUID();
            photoStore.create(id, file).then(() => {
                photoStore.getThumbnailURL(id).then((thumbUrl) => {
                    if (thumbUrl) {
                        setPhotos((prev) => [...prev, { id, thumbUrl }]);
                    }
                });
            });
        }

        e.target.value = "";
    };

    const removeImage = (id: string) => {
        photoStore.delete(id);
        setPhotos((prev) => prev.filter((photo) => photo.id !== id));
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl rounded-xl bg-white/20 backdrop-blur-2xl shadow-xl">
                <div className="px-6 py-2">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {photos.map((photo, index) => (
                            <div
                                key={photo.id}
                                className="relative aspect-square overflow-hidden rounded-xl shadow w-30 h-30 border border-white"
                            >
                                <img
                                    src={photo.thumbUrl}
                                    alt={`photo-${index}`}
                                    className="h-full w-full object-cover"
                                />
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="absolute top-1 right-1 h-7 w-7 rounded-full bg-destructive/70"
                                    onClick={() => removeImage(photo.id)}
                                >
                                    <FiX className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}

                        {photos.length < MAX_IMAGES && (
                            <button
                                type="button"
                                onClick={handleAddClick}
                                className="w-30 flex aspect-square items-center justify-center rounded-xl border border-white bg-white/50 text-muted-foreground shadow transition hover:bg-white/90"
                            >
                                <FiPlus className="h-8 w-8" />
                            </button>
                        )}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Button
                            type="button"
                            variant="secondary"
                            className="rounded-full px-8"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Card>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFilesSelected}
            />
        </div>
    );
}
