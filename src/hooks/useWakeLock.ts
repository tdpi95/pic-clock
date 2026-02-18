import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/**
 *
 * @param duration in millis
 * @returns
 */
export const useWakeLock = (duration: number) => {
    const [isActive, setIsActive] = useState(false);
    const wakeLockRef = useRef<WakeLockSentinel>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const requestLock = async () => {
        console.log("navigator:", navigator);

        const navObj: Record<string, unknown> = {};
        for (const key in navigator) {
            const value = navigator[key as keyof Navigator];

            if (typeof value !== "function") {
                navObj[key] = value;
            }
        }

        if ("wakeLock" in navigator) {
            try {
                wakeLockRef.current =
                    await navigator.wakeLock.request("screen");
                setIsActive(true);
                console.log("Screen Wake Lock is active");

                wakeLockRef.current.addEventListener("release", () => {
                    setIsActive(false);
                    console.log("Screen Wake Lock was released");
                });
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error(`${err.name}, ${err.message}`);
                }
            }
        } else {
            console.error("Wake Lock API not supported in this browser");
            toast.error("Wake Lock API not supported in this browser", {
                description: JSON.stringify(navObj),
                position: "top-left",
                duration: 20000,
            });
        }
    };

    const releaseLock = async () => {
        if (wakeLockRef.current) {
            await wakeLockRef.current.release();
            wakeLockRef.current = null;
        }
    };

    const startTimer = useCallback(() => {
        if (duration <= 0) return;

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            alert("Wake lock timed out!");
            releaseLock();
        }, duration);

        console.log("Wake lock timer started");
    }, [duration]);

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (
                wakeLockRef.current !== null &&
                document.visibilityState === "visible"
            ) {
                await requestLock();
                startTimer();
            }
        };

        const handleClick = async () => {
            if (wakeLockRef.current !== null) {
                await requestLock();
                startTimer();
            }
        };

        addEventListener("click", handleClick);
        addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            removeEventListener("visibilitychange", handleVisibilityChange);
            removeEventListener("click", handleClick);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [startTimer]);

    const autoHandle = () => {
        const handleVisibilityChange = async () => {
            if (
                wakeLockRef.current !== null &&
                document.visibilityState === "visible"
            ) {
                await requestLock();
                startTimer();
            }
        };

        const handleClick = async () => {
            await requestLock();
            startTimer();
        };

        requestLock();

        addEventListener("click", handleClick);
        addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            removeEventListener("visibilitychange", handleVisibilityChange);
            removeEventListener("click", handleClick);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    };

    return { isActive, requestLock, releaseLock, autoHandle };
};
