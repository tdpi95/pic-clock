import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Generates a UUID v4. Falls back to a manual implementation
 * if crypto.randomUUID is unavailable (e.g., insecure contexts like LAN/HTTP).
 */
export const generateUUID = (): string => {
    if (typeof window !== "undefined" && window.crypto?.randomUUID) {
        return window.crypto.randomUUID();
    }

    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (char) => {
        const c = Number(char);
        return (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16);
    });
};
