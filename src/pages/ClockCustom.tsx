import FontSelector from "@/components/FontSelector";
import FormField from "@/components/FormField";
import PositionSelector from "@/components/PositionSelector";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
    useSettings,
    type MovementType,
    type Position,
} from "@/context/SettingsContext";
import { loadGoogleFont } from "@/lib/utils";
import { useEffect, useState } from "react";

const fonts = [
    "Inter",
    "Open Sans",
    "Playfair Display",
    "Merriweather",
    "Oswald",
    "MonteCarlo",
    "Aldrich",
    "Shizuru",
];

const ClockCustom = () => {
    const { clockSettings, updateClockSettings } = useSettings();
    const [showedPanel, setShowedPanel] = useState<
        "none" | "photoSelector" | "positionSelector"
    >("none");

    useEffect(() => {
        loadGoogleFont(clockSettings.font);
    }, [clockSettings.font]);

    const updateMovement = (movement: MovementType) => {
        updateClockSettings({ ...clockSettings, movement });
    };

    const updateVisible = (visible: boolean) => {
        updateClockSettings({ ...clockSettings, visible });
    };

    const update24h = (twentyFourHour: boolean) => {
        updateClockSettings({ ...clockSettings, _24h: twentyFourHour });
    };

    const handleSelectorOpen = () => {
        fonts.forEach(loadGoogleFont);
    };

    const updateFont = (font: string) => {
        updateClockSettings({ ...clockSettings, font });
    };

    const updatePosition = (position: Position) => {
        updateClockSettings({ ...clockSettings, position });
    };

    return (
        <div className="p-4">
            <FieldGroup>
                <FieldLabel>
                    <Field orientation={"horizontal"}>
                        <FieldTitle>Visible</FieldTitle>
                        <Switch
                            checked={clockSettings.visible}
                            onCheckedChange={updateVisible}
                        />
                    </Field>
                </FieldLabel>
                <FieldLabel>
                    <Field orientation={"horizontal"}>
                        <FieldTitle>24 Hour Format</FieldTitle>
                        <Switch
                            checked={clockSettings._24h}
                            onCheckedChange={update24h}
                        />
                    </Field>
                </FieldLabel>
                <FormField label="Font" orientation="horizontal">
                    <Button
                        variant="outline-ghost"
                        onClick={() => setShowedPanel("photoSelector")}
                    >
                        <p
                            style={{
                                fontFamily: `'${clockSettings.font}', sans-serif`,
                            }}
                        >
                            {clockSettings.font}
                        </p>
                    </Button>
                </FormField>
                <FormField label="Size" orientation="horizontal">
                    <div className="flex items-center gap-4 w-48">
                        <Slider
                            min={1}
                            max={20}
                            step={0.1}
                            value={clockSettings.fontSize}
                            onValueChange={(val) =>
                                updateClockSettings({
                                    ...clockSettings,
                                    fontSize: val,
                                })
                            }
                        />
                        <span className="text-sm font-mono w-10 text-right">
                            {clockSettings.fontSize.toFixed(1)}
                        </span>
                    </div>
                </FormField>
                <FormField label="Movement" orientation="vertical">
                    <RadioGroup
                        value={clockSettings?.movement}
                        onValueChange={(value: MovementType) => {
                            updateMovement(value);
                        }}
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value="continuous"
                                id="continuous"
                            />
                            <label htmlFor="continuous">
                                Continuous (DVD logo bounce)
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="interval" id="interval" />
                            <label htmlFor="interval">Interval</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="static" id="static" />
                            <label htmlFor="static">Static</label>
                        </div>
                    </RadioGroup>
                </FormField>

                {clockSettings.movement == "static" && (
                    <FormField label="Position" orientation="horizontal">
                        <Button
                            variant="outline-ghost"
                            onClick={() => setShowedPanel("positionSelector")}
                        >
                            Position
                        </Button>
                    </FormField>
                )}
            </FieldGroup>

            <FontSelector
                visible={showedPanel === "photoSelector"}
                onSelect={updateFont}
                onClose={() => setShowedPanel("none")}
                onOpen={handleSelectorOpen}
                fonts={fonts}
            />

            <PositionSelector
                visible={showedPanel === "positionSelector"}
                onConfirm={updatePosition}
                onClose={() => setShowedPanel("none")}
            />
        </div>
    );
};

export default ClockCustom;
