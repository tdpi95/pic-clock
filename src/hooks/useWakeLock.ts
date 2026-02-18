import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/**
 *
 * @param duration in millis. -1: disable, 0: always on, >0: auto release after duration
 * @returns
 */
export const useWakeLock = (duration: number) => {
    const [isActive, setIsActive] = useState(false);
    const wakeLockRef = useRef<WakeLockSentinel>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const requestLock = async () => {
        if (duration < 0) return;

        console.log("navigator:", navigator);

        // const navObj: Record<string, unknown> = {};
        // for (const key in navigator) {
        //     const value = navigator[key as keyof Navigator];

        //     if (typeof value !== "function") {
        //         navObj[key] = value;
        //     }
        // }

        if ("wakeLock" in navigator) {
            try {
                wakeLockRef.current =
                    await navigator.wakeLock.request("screen");
                setIsActive(true);
                console.log("Screen wake lock is active");
                toast.success("Screen wake lock is active", {
                    position: "top-left",
                });

                wakeLockRef.current.addEventListener("release", () => {
                    setIsActive(false);
                    console.log("Screen wake lock was released");
                    toast.success("Screen wake lock was released", {
                        position: "top-left",
                    });
                });
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error(`${err.name}, ${err.message}`);
                }
            }
        } else {
            console.error("Wake Lock API not supported in this browser");
            toast.error("Wake Lock API not supported in this browser", {
                position: "top-left",
                duration: 5000,
            });
        }
    };

    const releaseLock = async () => {
        if (wakeLockRef.current) {
            try {
                await wakeLockRef.current.release();
            } catch (err: unknown) {
                if (err instanceof Error) {
                    toast.error(
                        `Error releasing wake lock: ${err.name}, ${err.message}`,
                    );
                }
                console.error("Error releasing wake lock:", err);
            }
            wakeLockRef.current = null;
        }
    };

    const startTimer = useCallback(() => {
        if (duration <= 0) return;

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            toast("Releasing wake lock...");
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
            await requestLock();
            startTimer();
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
