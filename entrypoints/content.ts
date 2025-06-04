export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    console.log("SuperScroll content script loaded!");

    let isScrolling = false;
    let scrollDirection: "up" | "down" = "down";
    let scrollSpeed = 2; // Speed preset index (0-7)
    let animationId: number | undefined;
    let lastTimestamp = 0;
    let highSpeedIntervalId: number | undefined;

    // Enhanced speed presets: much faster options for power users
    const SPEED_PRESETS = [
      { name: "Very Slow", pixelsPerSecond: 50 },
      { name: "Slow", pixelsPerSecond: 150 },
      { name: "Moderate", pixelsPerSecond: 300 },
      { name: "Fast", pixelsPerSecond: 600 },
      { name: "Very Fast", pixelsPerSecond: 1200 },
      { name: "Ultra Fast", pixelsPerSecond: 2500 },
      { name: "Ludicrous", pixelsPerSecond: 5000 },
      { name: "Insane", pixelsPerSecond: 10000 },
    ];

    // Ultra-fast scrolling that bypasses browser limitations
    function smoothScroll(timestamp: number) {
      if (!isScrolling) return;

      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
      }

      const deltaTime = timestamp - lastTimestamp;
      const currentSpeed = SPEED_PRESETS[scrollSpeed];

      // Calculate pixels to scroll based on time elapsed
      let pixelsToScroll = (currentSpeed.pixelsPerSecond * deltaTime) / 1000;

      // For ultra-high speeds, use direct DOM manipulation to bypass browser throttling
      if (currentSpeed.pixelsPerSecond > 1500) {
        // Use multiple smaller scrolls per frame for ultra-fast speeds
        const scrollsPerFrame = Math.ceil(currentSpeed.pixelsPerSecond / 3000);
        const pixelsPerScroll = pixelsToScroll / scrollsPerFrame;

        for (let i = 0; i < scrollsPerFrame; i++) {
          const scrollAmount =
            scrollDirection === "down" ? pixelsPerScroll : -pixelsPerScroll;

          // Direct DOM manipulation for maximum speed
          if (currentSpeed.pixelsPerSecond > 5000) {
            // Bypass smooth scrolling entirely for insane speeds
            document.documentElement.scrollTop += scrollAmount;
            document.body.scrollTop += scrollAmount; // Fallback for older browsers
          } else {
            // Use instant scrollBy for ultra-fast speeds
            window.scrollBy(0, scrollAmount);
          }
        }
      } else {
        // Normal scrolling for moderate speeds
        const scrollAmount =
          scrollDirection === "down" ? pixelsToScroll : -pixelsToScroll;
        window.scrollBy({
          top: scrollAmount,
          behavior: currentSpeed.pixelsPerSecond > 300 ? "auto" : "smooth",
        });
      }

      lastTimestamp = timestamp;

      if (isScrolling) {
        animationId = requestAnimationFrame(smoothScroll);
      }
    }

    function startScrolling(direction: "up" | "down") {
      if (isScrolling && scrollDirection === direction) return;

      stopScrolling();
      isScrolling = true;
      scrollDirection = direction;
      lastTimestamp = 0;

      const currentSpeed = SPEED_PRESETS[scrollSpeed];

      // For insane speeds (>8000 px/s), use high-frequency interval instead of RAF
      if (currentSpeed.pixelsPerSecond > 8000) {
        const pixelsPerInterval = currentSpeed.pixelsPerSecond / 100; // 100 intervals per second
        highSpeedIntervalId = window.setInterval(() => {
          if (!isScrolling) return;

          const scrollAmount =
            scrollDirection === "down" ? pixelsPerInterval : -pixelsPerInterval;

          // Direct DOM manipulation for maximum performance
          document.documentElement.scrollTop += scrollAmount;
          document.body.scrollTop += scrollAmount;

          // Also trigger window scroll for compatibility
          window.scrollBy(0, scrollAmount);
        }, 10); // 10ms = 100fps
      } else {
        // Use RAF for normal and fast speeds
        animationId = requestAnimationFrame(smoothScroll);
      }

      console.log(
        `Started scrolling ${direction} at ${SPEED_PRESETS[scrollSpeed].name} speed`,
      );
    }

    function stopScrolling() {
      isScrolling = false;

      // Clear RAF animation
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = undefined;
      }

      // Clear high-speed interval
      if (highSpeedIntervalId) {
        clearInterval(highSpeedIntervalId);
        highSpeedIntervalId = undefined;
      }

      lastTimestamp = 0;
      console.log("Scrolling stopped");
    }

    function setSpeed(newSpeed: number) {
      if (newSpeed >= 0 && newSpeed < SPEED_PRESETS.length) {
        scrollSpeed = newSpeed;
        console.log(`Speed set to: ${SPEED_PRESETS[scrollSpeed].name}`);
      }
    }

    // Auto-pause on user interaction
    function handleUserInteraction() {
      if (isScrolling) {
        stopScrolling();
        console.log("Auto-paused due to user interaction");
      }
    }

    // Add event listeners for auto-pause
    ["wheel", "touchstart", "keydown", "mousedown"].forEach((event) => {
      document.addEventListener(event, handleUserInteraction, {
        passive: true,
      });
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.altKey) {
        switch (e.key) {
          case "s":
          case "S":
            e.preventDefault();
            if (isScrolling) {
              stopScrolling();
            } else {
              startScrolling("down");
            }
            break;
          case "ArrowUp":
            e.preventDefault();
            startScrolling("up");
            break;
          case "ArrowDown":
            e.preventDefault();
            startScrolling("down");
            break;
          case "p":
          case "P":
            e.preventDefault();
            stopScrolling();
            break;
        }
      }
    });

    // Message handling for popup communication
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.type) {
        case "START_SCROLL_UP":
          startScrolling("up");
          sendResponse({
            status: "scrolling_up",
            speed: SPEED_PRESETS[scrollSpeed].name,
            direction: "up",
          });
          break;

        case "START_SCROLL_DOWN":
          startScrolling("down");
          sendResponse({
            status: "scrolling_down",
            speed: SPEED_PRESETS[scrollSpeed].name,
            direction: "down",
          });
          break;

        case "STOP_SCROLL":
          stopScrolling();
          sendResponse({
            status: "stopped",
            speed: SPEED_PRESETS[scrollSpeed].name,
          });
          break;

        case "SET_SPEED":
          setSpeed(message.speed);
          sendResponse({
            status: "speed_updated",
            speedName: SPEED_PRESETS[scrollSpeed].name,
            speed: scrollSpeed,
          });
          break;

        case "GET_STATUS":
          sendResponse({
            isScrolling,
            direction: scrollDirection,
            speed: scrollSpeed,
            speedName: SPEED_PRESETS[scrollSpeed].name,
          });
          break;

        default:
          sendResponse({ status: "unknown_command" });
      }
      return true; // Keep message channel open for async response
    });

    // Cleanup on page unload
    window.addEventListener("beforeunload", () => {
      stopScrolling();
    });
  },
});
