import * as React from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MAX_IMAGES = 99;

export interface PhotoSelectorProps {
    onClose?: () => void;
}

export default function PhotoSelector({ onClose }: PhotoSelectorProps) {
    const [images, setImages] = React.useState<string[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleAddClick = () => {
        fileInputRef.current?.click();
    };

    const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;

        const remaining = MAX_IMAGES - images.length;
        const selected = files.slice(0, remaining);

        const newUrls = selected.map((file) => URL.createObjectURL(file));
        setImages((prev) => [...prev, ...newUrls]);

        e.target.value = "";
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const showAddCell = images.length < MAX_IMAGES;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Outer selector card (blurred) */}
            <Card className="w-full max-w-4xl rounded-xl bg-white/20 backdrop-blur-2xl shadow-xl">
                <div className="p-6">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {/* Empty state: always render one full cell */}
                        {images.length === 0 && showAddCell && (
                            <button
                                type="button"
                                onClick={handleAddClick}
                                className="w-30 flex aspect-square items-center justify-center rounded-xl border border-white bg-white/40 text-muted-foreground shadow transition hover:bg-white/90"
                            >
                                <FiPlus className="h-8 w-8" />
                            </button>
                        )}

                        {/* Image cells */}
                        {images.map((src, index) => (
                            <div
                                key={src}
                                className="relative aspect-square overflow-hidden rounded-xl shadow"
                            >
                                <img
                                    src={src}
                                    alt={`photo-${index}`}
                                    className="h-full w-full object-cover"
                                />
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="absolute top-2 right-2 h-7 w-7 rounded-full"
                                    onClick={() => removeImage(index)}
                                >
                                    <FiX className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}

                        {/* Plus cell after images */}
                        {images.length > 0 && showAddCell && (
                            <button
                                type="button"
                                onClick={handleAddClick}
                                className="flex aspect-square items-center justify-center rounded-xl border border-white bg-white/40 text-muted-foreground shadow transition hover:bg-white/90"
                            >
                                <FiPlus className="h-8 w-8" />
                            </button>
                        )}
                    </div>

                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        {images.length} / {MAX_IMAGES} images
                    </p>

                    {/* Close button */}
                    <div className="mt-6 flex justify-center">
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
