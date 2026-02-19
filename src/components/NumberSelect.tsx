"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type OptionValue = number | string;

interface NumberSelectProps {
    values: OptionValue[];
    unit: string;
    selectedValue?: OptionValue;
    min?: number;
    max?: number;
    onValueChange: (value: OptionValue) => void;
}

export const NumberSelect: React.FC<NumberSelectProps> = ({
    values,
    unit,
    selectedValue,
    min,
    max,
    onValueChange,
}) => {
    const CUSTOM_KEY = "__custom__";

    const [open, setOpen] = React.useState(false);
    const [tempValue, setTempValue] = React.useState<number | "">("");
    const [allValues, setAllValues] = React.useState<OptionValue[]>(values);

    const formatUnit = (val: number) => (val > 1 ? `${unit}s` : unit);

    React.useEffect(() => {
        if (selectedValue !== undefined) {
            setAllValues((prev) => {
                if (!prev.includes(selectedValue)) {
                    return [...prev, selectedValue as OptionValue];
                }
                return prev;
            });
        }
    }, [selectedValue, allValues]);

    const renderLabel = (val?: OptionValue) => {
        if (val === undefined) return "Select value";

        if (typeof val === "number") {
            return `${val} ${formatUnit(val)}`;
        }

        return val;
    };

    const selectedKey = React.useMemo(() => {
        if (selectedValue === undefined) return undefined;

        if (typeof selectedValue === "number" && !allValues) {
            return CUSTOM_KEY;
        }

        return String(selectedValue);
    }, [selectedValue, allValues]);

    const handleSelectChange = (val: string) => {
        if (val === CUSTOM_KEY) {
            setTempValue(
                typeof selectedValue === "number" ? selectedValue : "",
            );
            setOpen(true);
            return;
        }

        const num = Number(val);
        if (!isNaN(num) && val.trim() !== "") {
            onValueChange(num);
        } else {
            onValueChange(val);
        }
    };

    const handleSaveCustom = () => {
        if (tempValue !== "") {
            const num = Number(tempValue);
            if (min !== undefined && num < min) {
                return;
            }

            if (max !== undefined && num > max) {
                return;
            }

            onValueChange(num);
            setOpen(false);
            setAllValues((prev) => {
                const newValues = [...prev];
                if (!newValues.includes(num)) {
                    newValues.push(num);
                }
                return newValues;
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === "") {
            setTempValue("");
            return;
        }

        const num = Number(val);
        if (!isNaN(num)) {
            setTempValue(num);
        }
    };

    return (
        <>
            <Select value={selectedKey} onValueChange={handleSelectChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Select option...">
                        {renderLabel(selectedValue)}
                    </SelectValue>
                </SelectTrigger>

                <SelectContent>
                    {allValues.map((val) => (
                        <SelectItem key={val} value={String(val)}>
                            {renderLabel(val)}
                        </SelectItem>
                    ))}

                    <SelectItem value={CUSTOM_KEY}>Custom...</SelectItem>
                </SelectContent>
            </Select>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-xs">
                    <DialogHeader>
                        <DialogTitle>Enter custom value</DialogTitle>
                    </DialogHeader>

                    <div className="flex items-center gap-2 mt-2">
                        <Input
                            type="number"
                            value={tempValue}
                            min={min}
                            max={max}
                            onChange={handleInputChange}
                            autoFocus
                        />
                        <span className="text-sm">
                            {tempValue !== ""
                                ? formatUnit(Number(tempValue))
                                : unit}
                        </span>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveCustom}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
