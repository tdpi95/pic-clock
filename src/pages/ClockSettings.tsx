import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSettings, type MovementType } from "@/context/SettingsContext";
import { useState } from "react";

interface ClockSettingsProps {
    visible: boolean;
    onClose: () => void;
}

const ClockSettings = ({ visible, onClose }: ClockSettingsProps) => {
    const { settings, updateSettings } = useSettings();
    const [tempClockSettings, setTempSettings] = useState(
        settings.clockSettings,
    );

    const saveSettings = () => {
        if (!tempClockSettings) return;

        updateSettings({
            clockSettings: tempClockSettings,
        });

        onClose();
    };

    const updateMovement = (movement: MovementType) => {
        if (!tempClockSettings) return;

        setTempSettings({
            ...tempClockSettings,
            movement,
        });
    };

    return (
        <>
            <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Clock Settings</DialogTitle>
                    </DialogHeader>

                    <div className="mt-2">
                        <label className="block text-sm font-medium mb-2">
                            Movement
                        </label>
                        <RadioGroup
                            value={tempClockSettings?.movement}
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
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={saveSettings}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ClockSettings;
