import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useSettings, type MovementType } from "@/context/SettingsContext";

const ClockCustom = () => {
    const { clockSettings, updateSettings } = useSettings();

    const updateMovement = (movement: MovementType) => {
        updateSettings({
            clock: {
                ...clockSettings,
                movement,
            },
        });
    };

    const updateVisible = (visible: boolean) => {
        updateSettings({
            clock: {
                ...clockSettings,
                visible,
            },
        });
    };

    const update24h = (twentyFourHour: boolean) => {
        updateSettings({
            clock: {
                ...clockSettings,
                _24h: twentyFourHour,
            },
        });
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
                <FieldLabel>
                    <Field>
                        <FieldTitle>Movement</FieldTitle>
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
                                <RadioGroupItem
                                    value="interval"
                                    id="interval"
                                />
                                <label htmlFor="interval">Interval</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="static" id="static" />
                                <label htmlFor="static">Static</label>
                            </div>
                        </RadioGroup>
                    </Field>
                </FieldLabel>
            </FieldGroup>
        </div>
    );
};

export default ClockCustom;
