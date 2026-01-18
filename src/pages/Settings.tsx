import React, { useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { Button } from "../components/ui/button"; // Assuming ShadCN Button
import { Input } from "../components/ui/input"; // Assuming ShadCN Input
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"; // Assuming ShadCN RadioGroup

const Settings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { settings, updateSettings } = useSettings();
    const [tempSettings, setTempSettings] = useState(settings);

    const handleSave = () => {
        updateSettings(tempSettings);
        onBack(); // Navigate back after saving
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Settings</h2>

            {/* Image Source Selection */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                    Image Source
                </label>
                <RadioGroup
                    value={tempSettings.imageSource}
                    onValueChange={(value: "picsum" | "bing" | "custom") =>
                        setTempSettings({ ...tempSettings, imageSource: value })
                    }
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="picsum" id="picsum" />
                        <label htmlFor="picsum">Picsum Photos</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bing" id="bing" />
                        <label htmlFor="bing">Bing Image of the Day</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="custom" />
                        <label htmlFor="custom">Custom URL</label>
                    </div>
                </RadioGroup>
            </div>

            {/* Custom URL Input (shown only if 'custom' is selected) */}
            {tempSettings.imageSource === "custom" && (
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Custom Image URL
                    </label>
                    <Input
                        type="url"
                        value={tempSettings.bgCustomUrl}
                        onChange={(e) =>
                            setTempSettings({
                                ...tempSettings,
                                bgCustomUrl: e.target.value,
                            })
                        }
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
            )}

            {/* Refresh Interval */}
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
                            refreshInterval: parseInt(e.target.value) * 60000, // Convert back to ms
                        })
                    }
                />
            </div>

            {/* Buttons */}
            <div className="flex space-x-2">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={onBack}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default Settings;
