import React, { useEffect } from "react";
import { Dialog } from "./Dialog";

interface FontSelectorProps {
    visible: boolean;
    fonts: string[];
    onClose: () => void;
    onOpen?: () => void;
    onSelect: (fontName: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({
    visible,
    fonts,
    onClose,
    onOpen,
    onSelect,
}) => {
    useEffect(() => {
        if (visible && onOpen) {
            onOpen();
        }
    }, [visible, onOpen]);

    if (!visible) return null;

    return (
        <Dialog visible={visible} onClose={onClose} header="Select Font">
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {fonts.map((font) => (
                    <button
                        key={font}
                        onClick={() => {
                            onSelect(font);
                            onClose();
                        }}
                        className="w-full rounded-lg px-4 py-3 text-left transition hover:bg-gray-100"
                        style={{ fontFamily: `'${font}', sans-serif` }}
                    >
                        {font}
                    </button>
                ))}
            </div>
        </Dialog>
    );
};

export default FontSelector;
