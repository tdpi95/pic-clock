import { cn } from "@/lib/utils";
import React from "react";

interface DynamicToggleProps {
    enabled: boolean;
    onChange: (state: boolean) => void;
    leftIcon: React.ReactNode;
    rightIcon: React.ReactNode;
    height?: number; // Height in pixels
    className?: string;
}

const DynamicToggle = ({
    enabled,
    onChange,
    leftIcon,
    rightIcon,
    height = 40,
    className = "",
}: DynamicToggleProps) => {
    const width = height * 2;
    const padding = height * 0.1; // 10% padding
    const knobSize = height - padding * 2;
    const translateX = enabled ? width - knobSize - padding * 2 : 0;

    return (
        <button
            onClick={() => onChange(!enabled)}
            style={{
                height: `${height}px`,
                width: `${width}px`,
                padding: `${padding}px`,
            }}
            className={cn(
                "relative flex shrink-0 cursor-pointer items-center rounded-full",
                "bg-gray-200 transition-colors duration-300 dark:bg-gray-700",
                className,
            )}
            role="switch"
            aria-checked={enabled}
        >
            {/* Sliding Knob */}
            <div
                style={{
                    height: `${knobSize}px`,
                    width: `${knobSize}px`,
                    transform: `translateX(${translateX}px)`,
                }}
                className="pointer-events-none rounded-full bg-white shadow transition-transform duration-300 ease-in-out"
            />

            {/* Icons Overlay */}
            <div
                className="absolute inset-0 flex items-center justify-between"
                style={{ padding: `0 ${padding * 2}px` }}
            >
                <div
                    className={`flex items-center justify-center transition-opacity duration-300 ${enabled ? "opacity-30" : "opacity-100"}`}
                >
                    {leftIcon}
                </div>
                <div
                    className={`flex items-center justify-center transition-opacity duration-300 ${enabled ? "opacity-100" : "opacity-30"}`}
                >
                    {rightIcon}
                </div>
            </div>
        </button>
    );
};

export default DynamicToggle;
