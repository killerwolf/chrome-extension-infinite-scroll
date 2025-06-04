import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  webExt: {
    chromiumArgs: ["--user-data-dir=./.wxt/chrome-data"],
    binaries: {
      chrome:
        "/Users/hlaadhar/.local/bin/chrome/mac_arm-136.0.7103.113/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing", // Use Chrome Beta instead of regular Chrome
    },
    startUrls: ["https://www.public.fr/"],
  },
  manifest: {
    name: "SuperScroll",
    version: "0.1.0",
    description:
      "An advanced auto-scroll Chrome extension with customizable features.",
    permissions: ["storage", "activeTab", "scripting"],
    host_permissions: ["<all_urls>"],
    icons: {
      "128": "icon/128.png",
    },
  },
  modules: ["@wxt-dev/module-react"],
});
