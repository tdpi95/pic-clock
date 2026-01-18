import "./App.css";
import { SettingsProvider } from "./context/SettingsContext";
import Home from "./pages/Home";

function App() {
    return (
        <SettingsProvider>
            <Home />
        </SettingsProvider>
    );
}

export default App;
