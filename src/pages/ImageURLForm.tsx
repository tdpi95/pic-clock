import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { LuPlus, LuTrash } from "react-icons/lu";

interface ImageURLFormProps {
    onClose?: () => void;
    onSave?: (urls: string[]) => void;
    maxUrls?: number;
}

export default function ImageURLForm({
    onClose,
    onSave,
    maxUrls = 1,
}: ImageURLFormProps) {
    const [urls, setUrls] = useState<string[]>([""]);

    const addUrlField = () => {
        setUrls([...urls, ""]);
    };

    const removeUrlField = (index: number) => {
        const newUrls = urls.filter((_, i) => i !== index);
        setUrls(newUrls.length > 0 ? newUrls : [""]);
    };

    const handleUrlChange = (index: number, value: string) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number,
    ) => {
        if (e.key === "Enter") {
            e.preventDefault();

            if (index === urls.length - 1 && urls[index].trim() !== "") {
                addUrlField();
                setTimeout(() => {
                    const inputs = document.querySelectorAll(".url-input");
                    (inputs[inputs.length - 1] as HTMLInputElement)?.focus();
                }, 0);
            }
        }
    };

    const save = (urls: string[]) => {
        if (onSave) {
            urls.map((url) => url.trim()).filter((url) => url !== "");
            onSave(urls);
        }

        if (onClose) {
            onClose();
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Image URLs</DialogTitle>
                </DialogHeader>

                <div className="space-y-3 mt-4">
                    {urls.map((url, index) => (
                        <div
                            key={index}
                            className="flex gap-2 items-center animate-in fade-in slide-in-from-top-1"
                        >
                            <Input
                                type="url"
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) =>
                                    handleUrlChange(index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="flex-1 url-input"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeUrlField(index)}
                                disabled={urls.length === 1 && url === ""}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <LuTrash className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    <div className="flex gap-2 items-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addUrlField}
                            className="flex-1 bg-white/60"
                            disabled={urls.length >= maxUrls}
                        >
                            <LuPlus className="w-4 h-4" />
                        </Button>
                        <span className="w-9" />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => save(urls)}
                        className="mt-5"
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
