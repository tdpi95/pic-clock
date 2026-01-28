import React, { useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { Button } from "../components/ui/button"; // Assuming ShadCN Button
import { Input } from "../components/ui/input"; // Assuming ShadCN Input
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"; // Assuming ShadCN RadioGroup
import PhotoSelector from "./PhotoSelector";
import { LuImageUp } from "react-icons/lu";
import ImageURLForm from "./ImageURLForm";

const WallpaperSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { settings, updateSettings } = useSettings();
    const [tempSettings, setTempSettings] = useState(settings);
    const [showedPanel, setShowedPanel] = useState("main");

    const handleSave = () => {
        updateSettings(tempSettings);
        onBack();
    };

    return (
        <div className="absolute min-h-screen w-full flex items-center justify-center bg-black/30">
            {showedPanel === "main" && (
                <div className="p-6 w-md bg-white/30 dark:bg-gray-800/25 rounded-lg shadow-lg backdrop-blur-lg">
                    <h2 className="text-xl font-bold mb-4">
                        Wallpaper Settings
                    </h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Image Source
                        </label>
                        <RadioGroup
                            value={tempSettings.imageSource}
                            onValueChange={(
                                value: "picsum" | "bing" | "custom" | "local",
                            ) => {
                                setTempSettings({
                                    ...tempSettings,
                                    imageSource: value,
                                });
                            }}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="picsum" id="picsum" />
                                <label htmlFor="picsum">Picsum Photos</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="bing" id="bing" />
                                <label htmlFor="bing">
                                    Bing Image of the Day
                                </label>
                            </div>
                            {/* <div className="flex items-center space-x-2">
                                <RadioGroupItem value="custom" id="custom" />
                                <label htmlFor="custom">Custom URL</label>
                                <LuImageUp
                                    onClick={() =>
                                        setShowedPanel("imageURLForm")
                                    }
                                    className="ml-2 cursor-pointer"
                                />
                            </div> */}
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="local" id="local" />
                                <label htmlFor="local">Local Photos</label>
                                <LuImageUp
                                    onClick={() =>
                                        setShowedPanel("photoSelector")
                                    }
                                    className="ml-2 cursor-pointer"
                                />
                            </div>
                        </RadioGroup>
                    </div>

                    {tempSettings.imageSource !== "bing" && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Refresh Interval (minutes)
                            </label>
                            <Input
                                type="number"
                                min="1"
                                value={tempSettings.refreshInterval / 60000} // Convert ms to minutes for display
                                onChange={(e) =>
                                    setTempSettings({
                                        ...tempSettings,
                                        refreshInterval:
                                            parseInt(e.target.value) * 60000, // Convert back to ms
                                    })
                                }
                            />
                        </div>
                    )}

                    <div className="flex space-x-2">
                        <Button onClick={handleSave}>Save</Button>
                        <Button variant="outline" onClick={onBack}>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {showedPanel === "photoSelector" && (
                <PhotoSelector onClose={() => setShowedPanel("main")} />
            )}

            {showedPanel === "imageURLForm" && (
                <ImageURLForm onClose={() => setShowedPanel("main")} />
            )}
        </div>
    );
};

export default WallpaperSettings;
