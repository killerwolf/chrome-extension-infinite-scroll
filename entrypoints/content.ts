export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    console.log("SuperScroll content script loaded!");

    let isScrolling = false;
    let scrollDirection: "up" | "down" = "down";
    let scrollSpeed = 300; // Speed in pixels per second (50-10000)
    let animationId: number | undefined;
    let lastTimestamp = 0;
    let subpixelRemainder = 0;

    function smoothScroll(timestamp: number) {
      if (!isScrolling) return;

      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
      }

      const elapsed = timestamp - lastTimestamp;
      // Long frames from tab suspension/throttling must not cause a large jump.
      const deltaTime = Math.min(Math.max(elapsed, 0), 100);
      subpixelRemainder += (scrollSpeed * deltaTime) / 1000;
      const wholePixels = Math.floor(subpixelRemainder);
      subpixelRemainder -= wholePixels;
      const scrollAmount =
        (scrollDirection === "down" ? 1 : -1) * wholePixels;

      if (scrollAmount !== 0) {
        window.scrollBy({ top: scrollAmount, behavior: "auto" });
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
      subpixelRemainder = 0;
      animationId = requestAnimationFrame(smoothScroll);

      console.log(
        `Started scrolling ${direction} at ${scrollSpeed} px/s`,
      );
    }

    function stopScrolling() {
      isScrolling = false;

      // Clear RAF animation
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = undefined;
      }

      lastTimestamp = 0;
      subpixelRemainder = 0;
      console.log("Scrolling stopped");
    }

    function setSpeed(newSpeed: number) {
      // Clamp to valid range (50-10000 px/s)
      const clampedSpeed = Math.max(50, Math.min(10000, newSpeed));
      scrollSpeed = clampedSpeed;
      console.log(`Speed set to: ${scrollSpeed} px/s`);
    }

    // Auto-pause on user interaction
    function handleUserInteraction() {
      if (isScrolling) {
        stopScrolling();
        console.log("Auto-paused due to user interaction");
      }
    }

    // Add event listeners for auto-pause
    for (const event of ["wheel", "touchstart", "keydown", "mousedown"]) {
      document.addEventListener(event, handleUserInteraction, {
        passive: true,
      });
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && isScrolling) {
        stopScrolling();
        console.log("Auto-paused while page was hidden");
      }
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
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      switch (message.type) {
        case "START_SCROLL_UP":
          startScrolling("up");
          sendResponse({
            status: "scrolling_up",
            speed: scrollSpeed,
            direction: "up",
          });
          break;

        case "START_SCROLL_DOWN":
          startScrolling("down");
          sendResponse({
            status: "scrolling_down",
            speed: scrollSpeed,
            direction: "down",
          });
          break;

        case "STOP_SCROLL":
          stopScrolling();
          sendResponse({
            status: "stopped",
            speed: scrollSpeed,
          });
          break;

        case "SET_SPEED":
          setSpeed(message.speed);
          sendResponse({
            status: "speed_updated",
            speed: scrollSpeed,
          });
          break;

        case "GET_STATUS":
          sendResponse({
            isScrolling,
            direction: scrollDirection,
            speed: scrollSpeed,
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
