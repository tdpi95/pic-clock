import { useSettings } from "@/context/SettingsContext";
import { useEffect, useState } from "react";
import Settings from "./Settings";
import placeHolderImg from "@/assets/wanaka.jpg";
import { LuSettings } from "react-icons/lu";
import { Button } from "@/components/ui/button";

const proxy = "https://api.allorigins.win/get?url=";
const bingUrl = encodeURIComponent(
    "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US",
);

function Home() {
    const { settings } = useSettings();
    const [bgImage, setBgImage] = useState("");
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const fetchImage = async () => {
            let url = "";
            if (settings.imageSource === "picsum") {
                const timestamp = Date.now();
                url = `https://picsum.photos/1920/1080?random=${timestamp}`;
            } else if (settings.imageSource === "bing") {
                try {
                    const bUrl = `${proxy}${bingUrl}`;
                    console.log("Fetching Bing image from: ", bUrl);
                    const response = await fetch(bUrl);
                    const data = await response.json();
                    const contents = JSON.parse(data.contents);
                    const imageUrl = contents.images[0].url;
                    url = `https://www.bing.com${imageUrl}`;
                } catch (error) {
                    console.error("Error fetching Bing image:", error);
                    url = placeHolderImg;
                }
            } else if (settings.imageSource === "custom") {
                url = settings.bgCustomUrl || placeHolderImg;
            }
            setBgImage(url);
        };

        fetchImage();
        const interval = setInterval(fetchImage, settings.refreshInterval);

        return () => clearInterval(interval);
    }, [settings]);

    return (
        <div
            className="bg-cover bg-center bg-no-repeat min-h-screen w-full"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {showSettings && <Settings onBack={() => setShowSettings(false)} />}
            <Button
                size="lg"
                variant="ghost"
                className="absolute bottom-4 right-4 text-white"
                onClick={() => setShowSettings((v) => !v)}
            >
                <LuSettings size={30} />
            </Button>
        </div>
    );
}

export default Home;
