import React, { useState } from "react";
import PhotoSelector from "./PhotoSelector";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ClockSettings from "./ClockSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WallpaperSettings from "./WallpaperSettings";
import ClockCustom from "./ClockCustom";

type PanelType = "main" | "photoSelector" | "clockSettings";

const MainSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [showedPanel, setShowedPanel] = useState<PanelType>("main");

    return (
        <>
            <Dialog
                open={showedPanel === "main"}
                onOpenChange={() => {
                    onBack();
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="wallpaper" className="w-full">
                        <TabsList className="w-full bg-white/30">
                            <TabsTrigger value="wallpaper">
                                Wallpaper
                            </TabsTrigger>
                            <TabsTrigger value="clock">Clock</TabsTrigger>
                        </TabsList>
                        {/* use fixed height "h-[50vh]" if content is too long */}
                        <div className="min-h-[40vh] max-h-[60vh] overflow-y-auto">
                            <TabsContent value="wallpaper">
                                <WallpaperSettings />
                            </TabsContent>
                            <TabsContent value="clock">
                                <ClockCustom />
                            </TabsContent>
                        </div>
                    </Tabs>

                    {/* <DialogFooter>
                        <Button variant="outline" onClick={onBack}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </DialogFooter> */}
                </DialogContent>
            </Dialog>

            <ClockSettings
                visible={showedPanel === "clockSettings"}
                onClose={() => setShowedPanel("main")}
            />

            {showedPanel === "photoSelector" && (
                <PhotoSelector onClose={() => setShowedPanel("main")} />
            )}
        </>
    );
};

export default MainSettings;
