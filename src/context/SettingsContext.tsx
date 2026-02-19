import { createContext, useContext, useEffect, useState } from "react";

interface Settings {
    imageSource: string;
    imageChangeInterval: number;
    uploadMode: "file" | "url";
    wakeLockDuration: number;
    initialized?: boolean;
}

interface SettingsContextType {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
    undefined,
);

const defaultSettings: Settings = {
    imageSource: "picsum",
    imageChangeInterval: 300000, // 5 minutes
    uploadMode: "file",
    wakeLockDuration: 300000, // 5 minutes
    initialized: false,
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isLoading, setLoading] = useState(true);

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
        setLoading(false);
    }, []);

    useEffect(() => {
        if (isLoading) return;
        settings.initialized = true;
        console.log("Saving settings to localStorage:", settings);
        localStorage.setItem("picClockSettings", JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
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
