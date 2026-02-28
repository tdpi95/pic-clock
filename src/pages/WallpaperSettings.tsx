import React, { useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import PhotoSelector from "./PhotoSelector";
import { LuImageUp } from "react-icons/lu";
import { NumberSelect } from "@/components/NumberSelect";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field";

type PanelType = "main" | "photoSelector" | "clockSettings";

const WallpaperSettings: React.FC = () => {
    const { wallpaperSettings, updateSettings } = useSettings();
    const [showedPanel, setShowedPanel] = useState<PanelType>("main");
    const [intervalMinutes, setIntervalMinutes] = useState<number | "">(
        wallpaperSettings.imageChangeInterval / 60000,
    );
    const [wakeLockValue, setWakeLockValue] = useState<number | string>(
        wallpaperSettings.wakeLockDuration === -1
            ? "Disabled"
            : wallpaperSettings.wakeLockDuration === 0
              ? "Always on"
              : wallpaperSettings.wakeLockDuration / 60000,
    );

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

        updateSettings({
            wallpaper: {
                ...wallpaperSettings,
                wakeLockDuration: duration,
            },
        });
    };

    const handleInterValMinutesChange = (value: number | string) => {
        if (typeof value === "string") return;

        setIntervalMinutes(value);

        updateSettings({
            wallpaper: {
                ...wallpaperSettings,
                imageChangeInterval: value * 60000,
            },
        });
    };

    const updateImageSource = (value: "picsum" | "bing" | "local") => {
        updateSettings({
            wallpaper: {
                ...wallpaperSettings,
                imageSource: value,
            },
        });
    };

    return (
        <div className="p-4">
            <FieldGroup>
                <FieldLabel>
                    <Field>
                        <FieldTitle>Photo source</FieldTitle>
                        <RadioGroup
                            value={wallpaperSettings.imageSource}
                            onValueChange={updateImageSource}
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
                    </Field>
                </FieldLabel>
                {wallpaperSettings.imageSource !== "bing" && (
                    <FieldLabel className="border-primary/60">
                        <Field orientation={"horizontal"}>
                            <FieldTitle>Image change interval</FieldTitle>
                            <NumberSelect
                                values={[1, 5, 10, 30, 60]}
                                unit="minute"
                                selectedValue={intervalMinutes}
                                min={1}
                                onValueChange={handleInterValMinutesChange}
                            />
                        </Field>
                    </FieldLabel>
                )}
                <FieldLabel className="border-primary/60">
                    <Field orientation={"horizontal"}>
                        <FieldTitle>Keep screen on</FieldTitle>
                        <NumberSelect
                            values={["Disabled", "Always on", 5, 10, 30]}
                            unit="minute"
                            selectedValue={wakeLockValue}
                            min={1}
                            onValueChange={handleWakeLockValueChange}
                        />
                    </Field>
                </FieldLabel>
            </FieldGroup>

            {showedPanel === "photoSelector" && (
                <PhotoSelector onClose={() => setShowedPanel("main")} />
            )}
        </div>
    );
};

export default WallpaperSettings;
