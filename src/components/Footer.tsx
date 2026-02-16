import {
    useState,
    useEffect,
    useRef,
    useCallback,
    type ReactNode,
} from "react";

interface StickyFooterProps {
    leftElement?: ReactNode;
    rightElement?: ReactNode;
    triggerElementRef?: React.RefObject<HTMLElement | null>;
}

const Footer: React.FC<StickyFooterProps> = ({
    leftElement,
    rightElement,
    triggerElementRef,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const footerRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            console.log("Timer ended, hiding footer");
            setIsVisible(false);
        }, 5000);

        console.log("Timer started");
    }, []);

    useEffect(() => {
        startTimer();

        const handleInteraction = (event: MouseEvent | TouchEvent) => {
            const isInside = footerRef.current?.contains(event.target as Node);

            if (isInside) {
                startTimer();
            } else if (
                triggerElementRef == null ||
                triggerElementRef.current == null ||
                triggerElementRef.current.contains(event.target as Node)
            ) {
                setIsVisible((prev) => !prev);
                startTimer();
            }
        };

        document.addEventListener("mousedown", handleInteraction);

        return () => {
            document.removeEventListener("mousedown", handleInteraction);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [startTimer]);

    return (
        <footer
            ref={footerRef}
            className="fixed bottom-0 left-0 w-full z-50 pointer-events-none overflow-hidden"
        >
            <div
                className={`absolute inset-0 h-full w-full bg-linear-to-t from-black/50 via-black/20 to-transparent transition-opacity duration-300 ${
                    isVisible ? "opacity-100" : "opacity-0"
                }`}
            />

            <div
                className={`relative mx-auto flex items-center justify-between p-4 transition-all duration-500 ease-in-out ${
                    isVisible
                        ? "translate-y-0 opacity-100 pointer-events-auto"
                        : "translate-y-full opacity-0 pointer-events-none"
                }`}
            >
                <div className="flex items-center gap-4 text-white">
                    {leftElement}
                </div>

                <div className="flex items-center gap-4 text-white">
                    {rightElement}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
