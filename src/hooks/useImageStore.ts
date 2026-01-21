import { ImageStore } from "@/db/ImageStore";
import { useRef } from "react";

export function useImageStore(storeName?: string): ImageStore {
    const storeRef = useRef<ImageStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = new ImageStore(storeName);
    }

    return storeRef.current;
}
