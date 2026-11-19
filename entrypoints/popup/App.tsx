import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { ChevronUp, ChevronDown, Pause, Zap } from "lucide-react";

const SPEED_PRESETS = [
  { name: "Very Slow", value: 0, description: "50 px/s" },
  { name: "Slow", value: 1, description: "150 px/s" },
  { name: "Moderate", value: 2, description: "300 px/s" },
  { name: "Fast", value: 3, description: "600 px/s" },
  { name: "Very Fast", value: 4, description: "1200 px/s" },
  { name: "Ultra Fast", value: 5, description: "2500 px/s" },
  { name: "Ludicrous", value: 6, description: "5000 px/s" },
  { name: "Insane", value: 7, description: "10000 px/s" },
];

// Define proper types for message communication
interface ScrollMessage {
  type: string;
  speed?: number;
}

interface ScrollResponse {
  status?: string;
  speed?: number;
  isScrolling?: boolean;
  direction?: "up" | "down";
  speedName?: string;
}

function App() {
  const [speed, setSpeed] = useState(2); // Default to Moderate
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null,
  );
  const [currentSpeedName, setCurrentSpeedName] = useState("Moderate");

  const sendMessageToContentScript = useCallback(
    (message: ScrollMessage, callback?: (response: ScrollResponse) => void) => {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (tabs: chrome.tabs.Tab[]) => {
          if (tabs[0]?.id) {
            if (callback) {
              chrome.tabs.sendMessage(tabs[0].id, message, callback);
            } else {
              chrome.tabs.sendMessage(tabs[0].id, message);
            }
          }
        },
      );
    },
    [],
  );

  // Get current status when popup opens
  useEffect(() => {
    sendMessageToContentScript({ type: "GET_STATUS" }, (response) => {
      if (response) {
        setIsScrolling(response.isScrolling || false);
        setScrollDirection(response.direction || null);
        setSpeed(response.speed || 2);
        setCurrentSpeedName(response.speedName || "Moderate");
      }
    });
  }, [sendMessageToContentScript]);

  const handleScrollUp = () => {
    sendMessageToContentScript({ type: "START_SCROLL_UP" }, (response) => {
      if (response?.status) {
        setIsScrolling(true);
        setScrollDirection("up");
        console.log(`Scrolling up at ${response.speed} speed`);
      }
    });
  };

  const handleScrollDown = () => {
    sendMessageToContentScript({ type: "START_SCROLL_DOWN" }, (response) => {
      if (response?.status) {
        setIsScrolling(true);
        setScrollDirection("down");
        console.log(`Scrolling down at ${response.speed} speed`);
      }
    });
  };

  const handlePause = () => {
    sendMessageToContentScript({ type: "STOP_SCROLL" }, (response) => {
      if (response?.status === "stopped") {
        setIsScrolling(false);
        setScrollDirection(null);
        console.log("Scrolling paused");
      }
    });
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSpeed = Number.parseInt(event.target.value, 10);
    setSpeed(newSpeed);
    const speedName = SPEED_PRESETS[newSpeed].name;
    setCurrentSpeedName(speedName);

    sendMessageToContentScript(
      { type: "SET_SPEED", speed: newSpeed },
      (response) => {
        if (response?.status === "speed_updated") {
          console.log(`Speed updated to: ${response.speedName}`);
        }
      },
    );
  };

  // Material Design helpers
  const card =
    "rounded-3xl bg-white dark:bg-[#23272f] shadow-lg px-8 py-7 w-full flex flex-col gap-4 border border-slate-100 dark:border-slate-800";
  const sectionTitle =
    "text-lg font-semibold text-blue-700 dark:text-blue-300 tracking-tight flex items-center gap-2 mb-1 justify-center text-center";
  const divider =
    "h-px w-full bg-slate-200 dark:bg-slate-700 my-4";
  const fab =
    "w-16 h-16 flex items-center justify-center rounded-full shadow-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition-all duration-150 text-2xl disabled:opacity-50 disabled:cursor-not-allowed";
  const fabAccent =
    "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600";
  const fabDanger =
    "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600";
  const chip =
    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-semibold shadow bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200";
  const chipActive =
    "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200";
  const chipPaused =
    "bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200";

  return (
    <div className="w-[400px] min-h-[600px] p-8 bg-[#f5f5f5] dark:bg-[#212121] flex flex-col gap-8 items-center justify-start rounded-3xl shadow-2xl mx-auto font-sans">
      {/* Header */}
      <div className="w-full flex flex-col items-center mb-2 mt-2">
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-600 dark:bg-blue-500 shadow-md mb-2">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 tracking-tight mb-1 text-center">SuperScroll</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium text-center">Intelligent Auto-Scrolling</p>
      </div>

      {/* Speed Selection */}
      <div className={card + " mt-2"}>
        <Label className={sectionTitle}>Scroll Speed</Label>
        <select
          value={speed}
          onChange={handleSpeedChange}
          disabled={isScrolling}
          className="w-full h-14 px-5 text-lg rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#23272f] text-slate-800 dark:text-slate-100 shadow-sm focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-2 mb-2"
        >
          {SPEED_PRESETS.map((preset) => (
            <option key={preset.value} value={preset.value}>
              {preset.name} ({preset.description})
            </option>
          ))}
        </select>
        <div className="flex items-center justify-between text-lg mt-2">
          <span className="text-slate-600 dark:text-slate-400">Current: <span className="font-semibold">{currentSpeedName}</span></span>
          <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg font-bold tracking-wide text-lg">
            {SPEED_PRESETS[speed].description}
          </span>
        </div>
      </div>

      {/* Status Indicator */}
      <div className={card + " flex-row items-center py-6 gap-6 mt-2"}>
        <div className="flex flex-col items-center gap-3 w-full">
          {isScrolling ? (
            scrollDirection === "up" ? (
              <ChevronUp className="w-9 h-9 animate-bounce text-blue-600 dark:text-blue-400" />
            ) : (
              <ChevronDown className="w-9 h-9 animate-bounce text-green-600 dark:text-green-400" />
            )
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-400" />
          )}
          <span className={
            chip +
            (isScrolling
              ? scrollDirection === "down"
                ? " " + chipActive
                : ""
              : chipPaused)
          }>
            {isScrolling
              ? `Scrolling ${scrollDirection}`
              : "Ready to scroll"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className={card + " flex-row items-center justify-center gap-12 py-8 mt-2"}>
        <Label className={sectionTitle + " mb-0 mr-6"}>Controls</Label>
        <div className="flex flex-row gap-8 items-center justify-center">
          <button
            onClick={handleScrollUp}
            className={fab + (scrollDirection === "up" ? " ring-4 ring-blue-300 dark:ring-blue-700 scale-105" : "")}
            title="Scroll Up (Alt + ↑)"
            aria-label="Scroll Up"
            tabIndex={0}
          >
            <ChevronUp className="w-8 h-8" />
          </button>
          <button
            onClick={handlePause}
            disabled={!isScrolling}
            className={fab + " " + fabDanger + (!isScrolling ? " opacity-50 cursor-not-allowed" : "")}
            title="Pause Scrolling (Alt + P)"
            aria-label="Pause"
            tabIndex={0}
          >
            <Pause className="w-8 h-8" />
          </button>
          <button
            onClick={handleScrollDown}
            className={fab + " " + fabAccent + (scrollDirection === "down" ? " ring-4 ring-green-300 dark:ring-green-700 scale-105" : "")}
            title="Scroll Down (Alt + ↓)"
            aria-label="Scroll Down"
            tabIndex={0}
          >
            <ChevronDown className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className={card + " py-6 mt-2"}>
        <Label className={sectionTitle}>Keyboard Shortcuts</Label>
        <div className={divider}></div>
        <div className="grid grid-cols-2 gap-4">
          <span className="text-slate-600 dark:text-slate-400">Start/Stop:</span>
          <kbd className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-lg font-mono">Alt + S</kbd>
          <span className="text-slate-600 dark:text-slate-400">Scroll Up:</span>
          <kbd className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-lg font-mono">Alt + ↑</kbd>
          <span className="text-slate-600 dark:text-slate-400">Scroll Down:</span>
          <kbd className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-lg font-mono">Alt + ↓</kbd>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full flex flex-row items-center justify-between text-lg text-slate-500 dark:text-slate-400 mt-8 mb-2 px-2">
        <span>SuperScroll v2.0</span>
        <span>Auto-pauses on interaction</span>
      </div>
    </div>
  );
}

export default App;
