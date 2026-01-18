import { useSettings } from "@/context/SettingsContext";
import { useEffect, useState } from "react";
import Settings from "./Settings";

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
                    url = "https://via.placeholder.com/1920x1080"; // Fallback
                }
            } else if (settings.imageSource === "custom") {
                url =
                    settings.bgCustomUrl ||
                    "https://via.placeholder.com/1920x1080";
            }
            setBgImage(url);
        };

        fetchImage();
        const interval = setInterval(fetchImage, settings.refreshInterval);

        return () => clearInterval(interval);
    }, [settings]);

    if (showSettings) {
        return <Settings onBack={() => setShowSettings(false)} />;
    }

    return (
        <div
            className="bg-cover bg-center bg-no-repeat min-h-screen w-full relative"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* Settings Button */}
            <button
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded"
                onClick={() => setShowSettings(true)}
            >
                Settings
            </button>

            {/* Your existing app content */}
            <h1 className="text-white">Pic Clock</h1>
            {/* ...existing code... */}
        </div>
    );
}

export default Home;
