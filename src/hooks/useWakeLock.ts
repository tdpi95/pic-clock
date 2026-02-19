import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/**
 *
 * @param initDuration in millis. -1: disable, 0: always on, >0: auto release after duration
 * @returns
 */
export const useWakeLock = (initDuration: number) => {
    const [isActive, setIsActive] = useState(false);
    const wakeLockRef = useRef<WakeLockSentinel>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [duration, setDuration] = useState(initDuration);
    const showedErrorRef = useRef(false);

    const requestLock = useCallback(async () => {
        if (duration < 0) return; // don't request if disabled

        // console.log("navigator:", navigator);

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
                console.log(
                    "Screen wake lock is active for " + duration + " ms",
                );

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
            if (!showedErrorRef.current) {
                toast.error("Wake lock API is not supported in this browser", {
                    position: "top-left",
                });
                showedErrorRef.current = true;
            }
        }
    }, [duration]);

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
        if (duration <= 0) return; // don't start timer if always on or disabled

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            releaseLock();
        }, duration);

        console.log("Wake lock timer started");
    }, [duration]);

    useEffect(() => {
        if (duration < 0) return;

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
    }, [duration]);

    const changeDuration = (dur: number) => {
        setDuration(dur);
    };

    return { isActive, requestLock, releaseLock, changeDuration };
};
