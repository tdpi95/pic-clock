import { createContext, useContext, useEffect, useState } from "react";

interface Position {
    x: number;
    y: number;
}

export type MovementType = "static" | "interval" | "continuous";

export interface ClockSettings {
    movement: MovementType;
    moveInterval: number; // for interval mode
    position: Position; // for static mode
    color1: string;
    color2: string;
    font: string;
    bgOpacity: number;
}

export interface WallpaperSettings {
    imageSource: string;
    imageChangeInterval: number;
    uploadMode: "file" | "url";
    wakeLockDuration: number;
}

interface Settings {
    wallpaper: WallpaperSettings;
    clock: ClockSettings;
}

interface SettingsContextType {
    settings: Settings;
    wallpaperSettings: WallpaperSettings;
    clockSettings: ClockSettings;
    updateSettings: (newSettings: Partial<Settings>) => void;
    isInitialized: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
    undefined,
);

const defaultSettings: Settings = {
    wallpaper: {
        imageSource: "picsum",
        imageChangeInterval: 300000, // 5 minutes
        uploadMode: "file",
        wakeLockDuration: -1, // disabled by default
    },
    clock: {
        movement: "continuous",
        moveInterval: 10000,
        position: { x: 100, y: 100 },
        color1: "#ffffff",
        color2: "#000000",
        font: "Arial",
        bgOpacity: 20,
    },
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [wallpaperSettings, setWallpaperSettings] =
        useState<WallpaperSettings>(defaultSettings.wallpaper);
    const [clockSettings, setClockSettings] = useState<ClockSettings>(
        defaultSettings.clock,
    );
    const [isInitialized, setInitialized] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("picClockSettings");
        if (stored) {
            console.log("Loading settings from localStorage:", stored);
            try {
                const parsed = JSON.parse(stored);
                setSettings({ ...defaultSettings, ...parsed });
            } catch (error) {
                console.error(
                    "Error parsing settings from localStorage:",
                    error,
                );
            }
        }
        setInitialized(true);
    }, []);

    useEffect(() => {
        setWallpaperSettings(settings.wallpaper);
        setClockSettings(settings.clock);

        if (!isInitialized) return;

        console.log("Saving settings to localStorage:", settings);
        localStorage.setItem("picClockSettings", JSON.stringify(settings));
    }, [settings, isInitialized]);

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    return (
        <SettingsContext.Provider
            value={{
                settings,
                wallpaperSettings,
                clockSettings,
                updateSettings,
                isInitialized,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};
