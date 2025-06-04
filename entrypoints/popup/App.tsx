import React, { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { ChevronUp, ChevronDown, Pause } from "lucide-react";

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

function App() {
  const [speed, setSpeed] = useState(2); // Default to Moderate
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null,
  );
  const [currentSpeedName, setCurrentSpeedName] = useState("Moderate");

  const sendMessageToContentScript = (
    message: any,
    callback?: (response: any) => void,
  ) => {
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
  };

  // Get current status when popup opens
  useEffect(() => {
    sendMessageToContentScript({ type: "GET_STATUS" }, (response) => {
      if (response) {
        setIsScrolling(response.isScrolling);
        setScrollDirection(response.direction);
        setSpeed(response.speed);
        setCurrentSpeedName(response.speedName);
      }
    });
  }, []);

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
    const newSpeed = parseInt(event.target.value);
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

  return (
    <div className="p-4 w-80 space-y-4 bg-background text-foreground">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-primary">SuperScroll</h1>
      </header>

      <main className="space-y-4">
        {/* Speed Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Speed</Label>
          <select
            value={speed}
            onChange={handleSpeedChange}
            disabled={isScrolling}
            className="w-full p-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {SPEED_PRESETS.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {preset.name} ({preset.description})
              </option>
            ))}
          </select>
        </div>

        {/* Control Buttons */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Controls</Label>
          <div className="grid grid-cols-3 gap-3">
            {/* Scroll Up Button */}
            <Button
              onClick={handleScrollUp}
              size="lg"
              className={`h-16 flex items-center justify-center transition-all duration-200 rounded-xl ${
                scrollDirection === "up"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-200 scale-105"
                  : "bg-gradient-to-br from-slate-100 to-slate-200 hover:from-blue-100 hover:to-blue-200 text-slate-600 hover:text-blue-700 shadow-sm hover:shadow-md"
              }`}
              title="Scroll Up"
            >
              <ChevronUp
                className={`${scrollDirection === "up" ? "h-8 w-8" : "h-7 w-7"} transition-all duration-200`}
              />
            </Button>

            {/* Pause Button */}
            <Button
              onClick={handlePause}
              disabled={!isScrolling}
              size="lg"
              className={`h-16 flex items-center justify-center transition-all duration-200 rounded-xl ${
                isScrolling
                  ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-200 cursor-pointer"
                  : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 cursor-not-allowed opacity-60 shadow-sm"
              }`}
              title={isScrolling ? "Click to Pause" : "Not Scrolling"}
            >
              <Pause className="h-7 w-7 transition-all duration-200" />
            </Button>

            {/* Scroll Down Button */}
            <Button
              onClick={handleScrollDown}
              size="lg"
              className={`h-16 flex items-center justify-center transition-all duration-200 rounded-xl ${
                scrollDirection === "down"
                  ? "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-200 scale-105"
                  : "bg-gradient-to-br from-slate-100 to-slate-200 hover:from-green-100 hover:to-green-200 text-slate-600 hover:text-green-700 shadow-sm hover:shadow-md"
              }`}
              title="Scroll Down"
            >
              <ChevronDown
                className={`${scrollDirection === "down" ? "h-8 w-8" : "h-7 w-7"} transition-all duration-200`}
              />
            </Button>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="text-center">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
              isScrolling
                ? scrollDirection === "up"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {isScrolling ? (
              <>
                {scrollDirection === "up" ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
                Active - {currentSpeedName}
              </>
            ) : (
              "Ready"
            )}
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-muted-foreground">
        <p>SuperScroll v0.1.0</p>
        <p className="mt-1">Auto-pauses on interaction</p>
      </footer>
    </div>
  );
}

export default App;
