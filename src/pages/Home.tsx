import { useSettings } from "@/context/SettingsContext";
import { useCallback, useEffect, useState } from "react";
import WallpaperSettings from "./WallpaperSettings";
import { LuImage } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { useImageStore } from "@/hooks/useImageStore";

const proxy = "https://whateverorigin.org/get?url=";
const bingUrl = encodeURIComponent(
    "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US",
);

const getPicsumImageUrl = () => {
    const timestamp = Date.now();
    console.log("Get new Picsum image");
    return `https://picsum.photos/1920/1080?random=${timestamp}`;
};

const getBingImageUrl = async () => {
    try {
        const bUrl = `${proxy}${bingUrl}`;
        console.log("Fetching Bing image from: ", bUrl);
        const response = await fetch(bUrl);
        const data = await response.json();
        const contents = JSON.parse(data.contents);
        const imageUrl = contents.images[0].url;
        return `https://www.bing.com${imageUrl}`;
    } catch (error) {
        console.error("Error fetching Bing image:", error);
        return "";
    }
};

function Home() {
    const { settings } = useSettings();
    const [showSettings, setShowSettings] = useState(false);

    const photoStore = useImageStore("photos");
    const [photoKeys, setPhotoKeys] = useState<string[]>([]);

    const [currentUrl, setCurrentUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);
    const [listIdx, setListIdx] = useState(0);

    const getNextUrl = useCallback(async () => {
        if (settings.imageSource === "local") {
            if (photoKeys.length === 0) return null;

            const nextIdx = (listIdx + 1) % photoKeys.length;
            const url = await photoStore.getOriginalURL(photoKeys[nextIdx]);
            setListIdx(nextIdx);
            console.log("Loading local image:", url);
            return url;
        } else if (settings.imageSource === "picsum") {
            return getPicsumImageUrl();
        } else if (settings.imageSource === "bing") {
            return getBingImageUrl();
        }
        return null;
    }, [settings.imageSource, photoKeys, listIdx, photoStore]);

    const handleNext = useCallback(() => {
        getNextUrl().then((url) => {
            setPendingUrl(url);
        });
    }, [getNextUrl]);

    const onImageReady = () => {
        setPrevUrl(currentUrl);
        setCurrentUrl(pendingUrl);
        setPendingUrl(null);
    };

    useEffect(() => {
        if (!settings.initialized) return;

        let refreshMillis = 0;
        switch (settings.imageSource) {
            case "picsum":
            case "local":
                refreshMillis = settings.refreshInterval;
                break;
            case "bing":
                refreshMillis = 60 * 60 * 1000; // 1 hour
                break;
        }

        if (refreshMillis <= 0) return;

        const interval = setInterval(handleNext, refreshMillis);

        return () => clearInterval(interval);
    }, [settings, handleNext]);

    useEffect(() => {
        console.log("image source changed:", settings.imageSource);
        const loadPhotoKeys = async () => {
            const keys = await photoStore.getAllKeys();
            setPhotoKeys(keys);
        };

        if (settings.initialized) {
            if (settings.imageSource === "local") {
                loadPhotoKeys();
            } else {
                handleNext();
            }
        }
    }, [settings.imageSource, settings.initialized]);

    useEffect(() => {
        if (photoKeys.length > 0) {
            handleNext();
        }
    }, [photoKeys]);

    return (
        <div className="relative min-h-screen w-full bg-linear-to-r from-blue-500 to-teal-800">
            {prevUrl && (
                <img
                    src={prevUrl}
                    className="absolute inset-0 h-full w-full object-cover animate-fade-in"
                />
            )}

            {currentUrl && (
                <img
                    key={currentUrl}
                    src={currentUrl}
                    className="absolute inset-0 h-full w-full object-cover animate-fade-in"
                />
            )}

            {pendingUrl && (
                <img
                    src={pendingUrl}
                    onLoad={onImageReady}
                    className="hidden"
                    alt=""
                />
            )}

            {showSettings && (
                <WallpaperSettings onBack={() => setShowSettings(false)} />
            )}
            <Button
                size="lg"
                variant="ghost"
                className="absolute bottom-4 right-4 text-white"
                onClick={() => setShowSettings((v) => !v)}
            >
                <LuImage size={30} />
            </Button>
        </div>
    );
}

export default Home;
