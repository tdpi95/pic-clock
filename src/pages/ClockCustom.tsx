import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

    return (
        <>
            <div className="mt-2">
                <label className="block text-sm font-medium mb-2">
                    Movement
                </label>
                <RadioGroup
                    value={clockSettings?.movement}
                    onValueChange={(value: MovementType) => {
                        updateMovement(value);
                    }}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="continuous" id="continuous" />
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
            </div>
        </>
    );
};

export default ClockCustom;
