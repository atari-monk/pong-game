import { FullscreenCanvas } from "@atari-monk/fullscreen-canvas";
import "@atari-monk/fullscreen-canvas/FullscreenCanvas.css";
import { PongGame } from "./PongGame";
import "./App.css";

export function App() {
    return (
        <div className="app">
            <FullscreenCanvas draw={PongGame.draw} loop={true} />
        </div>
    );
}
