import { useEffect, useRef } from "react";

const SPEED = 80;
const PANEL_WIDTH = 280;
const PANEL_HEIGHT = 140;

export default function FloatingClock() {
    const containerRef = useRef<HTMLDivElement>(null);

    const hourRef = useRef<HTMLSpanElement>(null);
    const minuteRef = useRef<HTMLSpanElement>(null);
    const secondRef = useRef<HTMLSpanElement>(null);
    const ampmRef = useRef<HTMLSpanElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);

    const velocity = useRef({ vx: 0, vy: 0 });
    const position = useRef({ x: 100, y: 100 });
    const lastTime = useRef(0);

    const normalizeVelocity = () => {
        const mag = Math.sqrt(
            velocity.current.vx ** 2 + velocity.current.vy ** 2,
        );
        velocity.current.vx = (velocity.current.vx / mag) * SPEED;
        velocity.current.vy = (velocity.current.vy / mag) * SPEED;
    };

    // update time without re-render
    const updateTime = () => {
        const now = new Date();

        const h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();

        const hours = String(h % 12 || 12).padStart(2, "0");
        const minutes = String(m).padStart(2, "0");
        const seconds = String(s).padStart(2, "0");
        const ampm = h >= 12 ? "PM" : "AM";

        if (hourRef.current) hourRef.current.textContent = hours;
        if (minuteRef.current) minuteRef.current.textContent = minutes;
        if (secondRef.current) secondRef.current.textContent = seconds;
        if (ampmRef.current) ampmRef.current.textContent = ampm;

        if (dateRef.current) {
            dateRef.current.textContent = now.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }
    };

    useEffect(() => {
        // init velocity
        velocity.current = {
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 - 1,
        };
        normalizeVelocity();

        lastTime.current = performance.now();

        const animate = (now: number) => {
            const dt = (now - lastTime.current) / 1000;
            lastTime.current = now;

            let { x, y } = position.current;

            x += velocity.current.vx * dt;
            y += velocity.current.vy * dt;

            const maxX = window.innerWidth - PANEL_WIDTH + 10;
            const maxY = window.innerHeight - PANEL_HEIGHT;

            if (x <= 0) {
                x = 0;
                velocity.current.vx *= -1;
            } else if (x >= maxX) {
                x = maxX;
                velocity.current.vx *= -1;
            }

            if (y <= 0) {
                y = 0;
                velocity.current.vy *= -1;
            } else if (y >= maxY) {
                y = maxY;
                velocity.current.vy *= -1;
            }

            position.current = { x, y };

            if (containerRef.current) {
                containerRef.current.style.transform = `translate(${x}px, ${y}px)`;
            }

            requestAnimationFrame(animate);
        };

        const raf = requestAnimationFrame(animate);

        // time updater (1/sec, no re-render)
        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => {
            cancelAnimationFrame(raf);
            clearInterval(interval);
        };
    }, []);

    return (
        <div ref={containerRef} className="fixed">
            <div
                className={`backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg rounded-2xl px-8 py-6 text-center text-white w-[${PANEL_WIDTH}px] h-[${PANEL_HEIGHT}px] flex flex-col justify-center`}
            >
                {/* Time */}
                <div className="flex items-end justify-center gap-1">
                    <span
                        ref={hourRef}
                        className="text-5xl md:text-6xl font-semibold tracking-tight"
                    >
                        00
                    </span>
                    <span className="text-5xl md:text-6xl tracking-tight">
                        :
                    </span>
                    <span
                        ref={minuteRef}
                        className="text-5xl md:text-6xl font-semibold tracking-tight"
                    >
                        00
                    </span>
                    <div className="flex flex-col items-start leading-none mb-1 ml-1">
                        <span ref={ampmRef} className="text-[10px] opacity-70">
                            AM
                        </span>
                        <span ref={secondRef} className="text-sm">
                            00
                        </span>
                    </div>
                </div>

                {/* Date */}
                <div ref={dateRef} className="text-md mt-2 opacity-80">
                    Loading...
                </div>
            </div>
        </div>
    );
}
