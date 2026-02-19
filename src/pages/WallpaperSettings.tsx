import React, { useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { Button } from "../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import PhotoSelector from "./PhotoSelector";
import { LuImageUp } from "react-icons/lu";
import { NumberSelect } from "@/components/NumberSelect";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const WallpaperSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { settings, updateSettings } = useSettings();
    const [tempSettings, setTempSettings] = useState(settings);
    const [showedPanel, setShowedPanel] = useState("main");
    const [intervalMinutes, setIntervalMinutes] = useState<number | "">(
        settings.imageChangeInterval / 60000,
    );
    const [wakeLockValue, setWakeLockValue] = useState<number | string>(
        settings.wakeLockDuration === -1
            ? "Disabled"
            : settings.wakeLockDuration === 0
              ? "Always on"
              : settings.wakeLockDuration / 60000,
    );

    const handleSave = () => {
        updateSettings(tempSettings);
        onBack();
    };

    const handleWakeLockValueChange = (value: number | string) => {
        console.log("Wake lock value change:", value);
        setWakeLockValue(value);
        let duration;
        if (value === "Disabled") {
            duration = -1;
        } else if (value === "Always on") {
            duration = 0;
        } else if (typeof value === "number") {
            duration = value * 60000;
        } else {
            console.warn("Invalid wake lock value:", value);
            return;
        }

        setTempSettings({
            ...tempSettings,
            wakeLockDuration: duration,
        });
    };

    const handleInterValMinutesChange = (value: number | string) => {
        if (typeof value === "string") return;

        setIntervalMinutes(value);

        setTempSettings({
            ...tempSettings,
            imageChangeInterval: value * 60000,
        });
    };

    return (
        <div className="absolute min-h-screen w-full flex items-center justify-center">
            <Dialog
                open={showedPanel === "main"}
                onOpenChange={() => {
                    onBack();
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Wallpaper Settings</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">
                        <label className="block text-sm font-medium mb-2">
                            Image source
                        </label>
                        <RadioGroup
                            value={tempSettings.imageSource}
                            onValueChange={(
                                value: "picsum" | "bing" | "local",
                            ) => {
                                setTempSettings({
                                    ...tempSettings,
                                    imageSource: value,
                                });
                            }}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="picsum" id="picsum" />
                                <label htmlFor="picsum">
                                    Picsum (random photos)
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="bing" id="bing" />
                                <label htmlFor="bing">
                                    Bing Image of the Day
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="local" id="local" />
                                <label htmlFor="local">Local photos</label>
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
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Image change interval
                            </label>
                            <NumberSelect
                                values={[1, 5, 10, 30, 60]}
                                unit="minute"
                                selectedValue={intervalMinutes}
                                min={1}
                                onValueChange={handleInterValMinutesChange}
                            />
                        </div>
                    )}

                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-2">
                            Keep screen on
                        </label>
                        <NumberSelect
                            values={["Disabled", "Always on", 5, 10, 30]}
                            unit="minute"
                            selectedValue={wakeLockValue}
                            min={1}
                            onValueChange={handleWakeLockValueChange}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={onBack}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {showedPanel === "photoSelector" && (
                <PhotoSelector onClose={() => setShowedPanel("main")} />
            )}
        </div>
    );
};

export default WallpaperSettings;
